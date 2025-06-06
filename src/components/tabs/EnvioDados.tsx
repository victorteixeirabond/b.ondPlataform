import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CardResult, CardResultContent, CardResultDescription, CardResultHeader, CardResultTitle } from "../ui/card result";
import FileUpload from "../FileUpload";
import { toast } from "@/hooks/use-toast";

const EnvioDados = ({ onFetchComplete }) => {
  const [formData, setFormData] = useState({
    taxaCessao: "",
    dataCarteira: "",
    potencialCessao: "",
    numeroSimulacoes: "",
  });

  const [formData2, setFormData2] = useState({
    messageId: ""
  });


  const [selectedXMLFiles, setSelectedXMLFiles] = useState<File[]>([]);
  const [cnabFiles, setCnabFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false); // loading state for CNAB processing
  const [uploadResponse, setUploadResponse] = useState<any>(null);

  const isReady = selectedXMLFiles.length > 0;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleInputChange2 = (field: string, value: string) => {
    setFormData2(prev => ({ ...prev, [field]: value }));
  };

  const handleTransformarCnab = async () => {
    if (cnabFiles.length === 0) {
      toast({
        title: "Erro",
        description: "Selecione ao menos um arquivo CNAB para transformar.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    toast({
      title: "Processando CNAB",
      description: `Transformando ${cnabFiles.length} arquivo(s) CNAB para formato Finaxis...`
    });

    const formData = new FormData();
    cnabFiles.forEach((file) => {
      formData.append("files", file); // Use "files[]" if backend expects an array
    });

    try {
      const response = await fetch("https://blb9c7huc7.execute-api.sa-east-1.amazonaws.com/Prod/", {
        method: "POST",
        body: formData,
        headers: {
          'x-api-key':import.meta.env.VITE_API_KEY
        }
      });

      if (!response.ok) {
        throw new Error(`Erro do servidor: ${response.status}`);
      }

      const result = await response.json();
      setUploadResponse(result.cnab);

      toast({
        title: "Sucesso",
        description: "Arquivos CNAB processados com sucesso!"
      });

      console.log("Resultado do processamento:", result);
    } catch (error) {
      console.error("Erro ao enviar arquivos CNAB:", error);
      toast({
        title: "Erro no envio",
        description: "Não foi possível processar os arquivos. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadNF = async (): Promise<void> => {
    if (selectedXMLFiles.length === 0) {
      toast({
        title: "Erro",
        description: "Selecione ao menos uma Nota Fiscal para enviar.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    toast({
      title: "Enviando Notas Fiscais",
      description: `Enviando ${selectedXMLFiles.length} arquivo(s)...`
    });

    const formData = new FormData();
    selectedXMLFiles.forEach((file: File) => {
      formData.append("files", file);
    });

    try {
      const response = await fetch("https://aqt3khbctj.execute-api.sa-east-1.amazonaws.com/UploadNotas/envia-notas", {
        method: "POST",
        headers: {
          "x-api-key": import.meta.env.VITE_API_KEY
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Erro do servidor: ${response.status}`);
      }

      const result: unknown = await response.json(); // type-safe default
      console.log("Resposta do servidor:", result);

      toast({
        title: "Upload realizado",
        description: `${selectedXMLFiles.length} Nota(s) Fiscal(is) enviada(s) com sucesso.`
      });

    } catch (error: unknown) {
      console.error("Erro ao enviar Notas Fiscais:", error);
      toast({
        title: "Erro no envio",
        description: "Não foi possível enviar as notas fiscais. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculaResultados = async () => {
    const requiredFields = ['messageId'];
    const missingFields = requiredFields.filter(field => !formData2[field as keyof typeof formData2]);

    if (missingFields.length > 0) {
      toast({
        title: "Campo obrigatório",
        description: "Preencha o id.",
        variant: "destructive"
      });
      return;
    }

    const payload = {
      messageId: formData2.messageId
    };

    setIsLoading(true);

    try {
      const res = await fetch("https://mcjranm5ra.execute-api.sa-east-1.amazonaws.com/Prod/retrieveResult", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_API_KEY
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error(`Erro do servidor: ${res.status}`);
      const result = await res.json();

      // ✅ call onFetchComplete only if it's defined
      if (typeof onFetchComplete === "function") {
        onFetchComplete(result);
      }

      toast({
        title: "Sucesso",
        description: "Resultados obtidos com sucesso."
      });

      return result;
    } catch (error) {
      console.error("Erro na requisição:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao buscar os resultados.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false); // ✅ always reset loading
    }
  };


  const handleAplicarCriterios = async () => {
    const requiredFields = ['taxaCessao', 'dataCarteira', 'potencialCessao', 'numeroSimulacoes'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);

    if (!uploadResponse) {
      toast({
        title: "Erro",
        description: "Nenhum CNAB processado. Por favor, envie um arquivo CNAB primeiro.",
        variant: "destructive"
      });
      return;
    }

    if (missingFields.length > 0) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos do formulário.",
        variant: "destructive"
      });
      return;
    }

    const payload = {
      taxa_ces: formData.taxaCessao,
      data: formData.dataCarteira,
      pot_ces: formData.potencialCessao,
      num_cart: formData.numeroSimulacoes,
      cnab: uploadResponse
    };

    toast({
      title: "Critérios aplicados",
      description: "Análise de elegibilidade iniciada com sucesso."
    });

    setIsLoading(true);

    try {
      const response = await fetch("https://mrpqusx8p7.execute-api.sa-east-1.amazonaws.com/Prod/sendMessage", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        "x-api-key": import.meta.env.VITE_API_KEY
        },
        body: JSON.stringify(payload)
      });
    

      const result = await response.json();
      
      const pollForResult = (messageIdd: string) => {
        const interval = setInterval(async () => {
          try {

            const payload = {
              messageId:messageIdd
            };
            const response = await fetch('https://mcjranm5ra.execute-api.sa-east-1.amazonaws.com/Prod/status2', {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-api-key": import.meta.env.VITE_API_KEY
              },
              body: JSON.stringify(payload)
            });

            if (response.status === 203) {
              clearInterval(interval);
              setFormData2({ messageId: messageIdd} )
              const result = await response.json();
              
            }
          } catch (error) {
            console.error("Erro ao verificar status:", error);
            clearInterval(interval);
            toast({
              title: "Erro",
              description: "Falha ao verificar o status da análise.",
              variant: "destructive"
            });
          }
        }, 3000); // 3 seconds
      };

      pollForResult(result.messageId)

      toast({
        title: "Critérios aplicados",
        description: "Análise concluída com sucesso!"
      });

      if (!response.ok) {
        throw new Error(`Erro do servidor: ${response.status}`);
      }

      console.log("Resultado da análise:", result);
        } catch (error) {
      console.error("Erro ao aplicar critérios:", error);
      toast({
        title: "Erro na análise",
        description: "Não foi possível aplicar os critérios.",
        variant: "destructive"
            });
          } finally {
      setIsLoading(false);
    }
  }
    

  return (
    <div className="space-y-6">
      {/* Upload de Arquivos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-eucalyptus-dark">Notas Fiscais</CardTitle>
            <CardDescription>Step 1</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <FileUpload
              title="Upload Notas Fiscais"
              acceptedTypes=".xml"
              multiple={true}
              onFileSelect={setSelectedXMLFiles}
              selectedFiles={selectedXMLFiles}
              isLoading={isLoading}
              handleFunction={handleUploadNF}
            />

          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-eucalyptus-dark">Arquivos CNAB</CardTitle>
            <CardDescription>Step 2</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <FileUpload
              title="Upload CNAB (400 ou 600)"
              acceptedTypes=".txt,.cnab"
              onFileSelect={setCnabFiles}
              multiple={true}
              selectedFiles={cnabFiles}
              isLoading={isLoading}
              handleFunction={handleTransformarCnab}
            />
          </CardContent>
        </Card>

        
      </div>

      {/* Formulário de Configuração */}
      <Card>
        <CardHeader>
          <CardTitle className="text-eucalyptus-dark">Configuração da Simulação</CardTitle>
          <CardDescription>Step 3</CardDescription>
        </CardHeader>
        <div className="flex items-center">
        <CardContent>
          <div className="grid grid-cols- md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="taxaCessao">Taxa de Cessão (%)</Label>
              <Input
                id="taxaCessao"
                type="number"
                step="0.01"
                placeholder="Ex: 2.5"
                value={formData.taxaCessao}
                onChange={(e) => handleInputChange('taxaCessao', e.target.value)}
                className="border-gray-300 focus:border-eucalyptus-dark"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataCarteira">Data da Carteira</Label>
              <Input
                id="dataCarteira"
                type="date"
                value={formData.dataCarteira}
                onChange={(e) => handleInputChange('dataCarteira', e.target.value)}
                className="border-gray-300 focus:border-eucalyptus-dark"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="potencialCessao">Potencial de Cessão (R$)</Label>
              <Input
                id="potencialCessao"
                type="number"
                placeholder="Ex: 1000000"
                value={formData.potencialCessao}
                onChange={(e) => handleInputChange('potencialCessao', e.target.value)}
                className="border-gray-300 focus:border-eucalyptus-dark"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="numeroSimulacoes">Número de Simulações</Label>
              <Input
                id="numeroSimulacoes"
                type="number"
                min="1"
                placeholder="Ex: 3"
                value={formData.numeroSimulacoes}
                onChange={(e) => handleInputChange('numeroSimulacoes', e.target.value)}
                className="border-gray-300 focus:border-eucalyptus-dark"
              />
            </div>
          </div>
        </CardContent>
        <Button
          onClick={handleAplicarCriterios}
          className="  hover:bg-eucalyptus-dark text-eucalyptus-dark hover:text-white py-20 px-[250px]"
        >
          Aplicar Elegibilidade
        </Button>
        </div>
      </Card>


      <CardResult>
        <CardResultHeader>
          <div>
            <CardResultTitle >Resultados</CardResultTitle>
            <label>Insira seu ID ou simule!</label>
          </div>
        <div className="flex flex-wrap items-end gap-8">
          <div className="space-y-2">
              <Input
                type="string"
                placeholder="Ex: 1000000"
                value={formData2.messageId}
                onChange={(e) => handleInputChange2('messageId', e.target.value)}
                className="border-gray-300 focus:border-eucalyptus-dark"
              />
            </div>

            <Button className="hover:bg-eucalyptus-dark bg-eucalyptus-dark text-white"
              onClick={calculaResultados}>
              Ver Resultado
            </Button>
          </div>

          <CardResultDescription>Step 4</CardResultDescription>
        </CardResultHeader>

      </CardResult>
    </div>
  );
};

export default EnvioDados