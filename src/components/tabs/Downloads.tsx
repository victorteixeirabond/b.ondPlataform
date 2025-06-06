
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Download, FileSpreadsheet } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Downloads = () => {
  const [selectedSimulation, setSelectedSimulation] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const downloadOptions = [
    {
      id: "carteira-pos-cessao",
      label: "Carteira Pós-Cessão",
      description: "Lista de créditos aprovados após aplicação dos critérios"
    },
    {
      id: "carteira-nova",
      label: "Carteira Nova",
      description: "Dados da carteira original antes da análise"
    },
    {
      id: "creditos-recusados",
      label: "Créditos Recusados",
      description: "Lista detalhada dos créditos reprovados com motivos"
    }
  ];

  const handleOptionChange = (optionId: string, checked: boolean) => {
    if (checked) {
      setSelectedOptions(prev => [...prev, optionId]);
    } else {
      setSelectedOptions(prev => prev.filter(id => id !== optionId));
    }
  };

  const handleDownload = () => {
    if (!selectedSimulation) {
      toast({
        title: "Erro",
        description: "Selecione uma simulação para realizar o download.",
        variant: "destructive"
      });
      return;
    }

    if (selectedOptions.length === 0) {
      toast({
        title: "Erro",
        description: "Selecione ao menos um tipo de arquivo para download.",
        variant: "destructive"
      });
      return;
    }

    // Simular download
    toast({
      title: "Download iniciado",
      description: `Gerando ${selectedOptions.length} arquivo(s) da Simulação ${selectedSimulation}...`
    });

    // Aqui seria implementada a lógica real de download
    setTimeout(() => {
      toast({
        title: "Download concluído",
        description: "Arquivos baixados com sucesso!"
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Seleção de Simulação */}
      <Card>
        <CardHeader>
          <CardTitle className="text-eucalyptus-dark">Seleção de Simulação</CardTitle>
          <p className="text-sm text-gray-600">
            Escolha a simulação da qual deseja baixar os arquivos
          </p>
        </CardHeader>
        <CardContent>
          <div className="w-full max-w-xs">
            <Select value={selectedSimulation} onValueChange={setSelectedSimulation}>
              <SelectTrigger className="border-gray-300 focus:border-eucalyptus-dark">
                <SelectValue placeholder="Escolha a simulação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Simulação 1</SelectItem>
                <SelectItem value="2">Simulação 2</SelectItem>
                <SelectItem value="3">Simulação 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Opções de Download */}
      <Card>
        <CardHeader>
          <CardTitle className="text-eucalyptus-dark">Tipos de Arquivo</CardTitle>
          <p className="text-sm text-gray-600">
            Selecione os tipos de relatório que deseja baixar
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {downloadOptions.map((option) => (
              <div key={option.id} className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Checkbox
                  id={option.id}
                  checked={selectedOptions.includes(option.id)}
                  onCheckedChange={(checked) => handleOptionChange(option.id, checked as boolean)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <label
                    htmlFor={option.id}
                    className="text-sm font-medium text-gray-900 cursor-pointer"
                  >
                    {option.label}
                  </label>
                  <p className="text-xs text-gray-600 mt-1">
                    {option.description}
                  </p>
                </div>
                <FileSpreadsheet className="h-5 w-5 text-green-600" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Informações do Download */}
      {selectedSimulation && selectedOptions.length > 0 && (
        <Card className="border-eucalyptus-light bg-eucalyptus-pale/20">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <FileSpreadsheet className="h-6 w-6 text-eucalyptus-dark" />
              <h3 className="font-medium text-eucalyptus-dark">
                Resumo do Download
              </h3>
            </div>
            
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Simulação:</span> {selectedSimulation}
              </p>
              <p>
                <span className="font-medium">Arquivos selecionados:</span> {selectedOptions.length}
              </p>
              <p>
                <span className="font-medium">Formato:</span> Excel (.xlsx)
              </p>
              <p>
                <span className="font-medium">Tamanho estimado:</span> ~{selectedOptions.length * 2.5}MB
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Botão de Download */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div>
              <h3 className="font-medium text-gray-900">Realizar Download</h3>
              <p className="text-sm text-gray-600">
                Os arquivos serão baixados em formato Excel (.xlsx)
              </p>
            </div>
            
            <Button
              onClick={handleDownload}
              disabled={!selectedSimulation || selectedOptions.length === 0}
              className="bg-green-600 hover:bg-green-700 text-white min-w-[200px]"
            >
              <Download className="h-4 w-4 mr-2" />
              Baixar Arquivos (.xlsx)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Histórico de Downloads */}
      <Card>
        <CardHeader>
          <CardTitle className="text-eucalyptus-dark">Histórico de Downloads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { data: "2024-01-15 14:30", simulacao: "Simulação 3", arquivos: "3 arquivos", status: "Concluído" },
              { data: "2024-01-15 11:20", simulacao: "Simulação 2", arquivos: "2 arquivos", status: "Concluído" },
              { data: "2024-01-14 16:45", simulacao: "Simulação 1", arquivos: "3 arquivos", status: "Concluído" },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{item.simulacao}</p>
                  <p className="text-xs text-gray-600">{item.data}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-900">{item.arquivos}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Downloads;
