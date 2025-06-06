
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";

type AnaliseEstatisticaProps = {
  response: any; // Replace `any` with a proper type if known
};

const AnaliseEstatistica = ({ response }) => {
  const [selectedSimulation, setSelectedSimulation] = useState("0");
  const [responseData, setResponseData] = useState(null);

  console.log(response);

  const simulacoes = response?.simulacoes ?? [];
  const simulacaoAtual = simulacoes[parseInt(selectedSimulation, 10)];

  if (!simulacaoAtual) {return <p>Nenhuma simulação disponível.</p>;}

  const creditosAprovados = simulacaoAtual?.creditosAprovados;
  const creditosReprovados = simulacaoAtual?.creditosReprovados;
  const motivosRecusa = simulacaoAtual?.motivosRecusa ?? [];
  const valorPorVencimento = [
    { mes: "Jan", valor: 120000 },
    { mes: "Fev", valor: 98000 },
    { mes: "Mar", valor: 145000 },
    { mes: "Abr", valor: 167000 },
    { mes: "Mai", valor: 134000 },
    { mes: "Jun", valor: 189000 },
  ];

  const distribuicaoPorUF = [
    { uf: "SP", valor: 450000, percentage: 35 },
    { uf: "RJ", valor: 280000, percentage: 22 },
    { uf: "MG", valor: 190000, percentage: 15 },
    { uf: "RS", valor: 150000, percentage: 12 },
    { uf: "PR", valor: 120000, percentage: 9 },
    { uf: "Outros", valor: 90000, percentage: 7 },
  ];

  const COLORS = ['#166e63', '#a7e1c3', '#d1eae6', '#f5f5dc', '#6b7280', '#9ca3af'];

  return (
  <>
  <div className="space-y-6">
    {/* Seletor de Simulação */}
    <Card>
      <CardHeader>
        <CardTitle className="text-eucalyptus-dark">Seleção de Simulação</CardTitle>
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

    {/* Gráficos */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gráfico de Valor por Data de Vencimento */}
      <Card>
        <CardHeader>
          <CardTitle className="text-eucalyptus-dark">Valor por Data de Vencimento</CardTitle>
          <p className="text-sm text-gray-600">Simulação {selectedSimulation}</p>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={valorPorVencimento}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="mes" 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#6b7280"
                  fontSize={12}
                  tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip 
                  formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Valor']}
                  labelStyle={{ color: '#166e63' }}
                  contentStyle={{ 
                    backgroundColor: '#f8f9fa', 
                    border: '1px solid #d1eae6',
                    borderRadius: '8px'
                  }}
                />
                <Bar 
                  dataKey="valor" 
                  fill="#166e63"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Gráfico de Distribuição por UF */}
      <Card>
        <CardHeader>
          <CardTitle className="text-eucalyptus-dark">Distribuição por UF</CardTitle>
          <p className="text-sm text-gray-600">Simulação {selectedSimulation}</p>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distribuicaoPorUF}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ uf, percentage }) => `${uf} (${percentage}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="valor"
                >
                  {distribuicaoPorUF.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Valor']}
                  contentStyle={{ 
                    backgroundColor: '#f8f9fa', 
                    border: '1px solid #d1eae6',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Legenda personalizada */}
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            {distribuicaoPorUF.map((item, index) => (
              <div key={item.uf} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-gray-700">
                  {item.uf}: R$ {item.valor.toLocaleString('pt-BR')}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>

    {/* Estatísticas Resumidas */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Total da Carteira</p>
            <p className="text-2xl font-bold text-eucalyptus-dark">R$ 1.280.000</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Prazo Médio</p>
            <p className="text-2xl font-bold text-eucalyptus-dark">127 dias</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Quantidade de Títulos</p>
            <p className="text-2xl font-bold text-eucalyptus-dark">2.450</p>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>

  <div className="space-y-6">
    {/* Cards de Resumo */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Créditos Aprovados */}
      <Card className="border-green-200">
        <CardHeader className="flex flex-row items-center space-y-0 pb-2">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <CardTitle className="text-green-700">Créditos Aprovados</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <p className="text-3xl font-bold text-green-600">
                {creditosAprovados.quantidade.toLocaleString('pt-BR')}
              </p>
              <p className="text-sm text-gray-600">títulos aprovados</p>
            </div>
            
            <div>
              <p className="text-2xl font-semibold text-green-600">
                R$ {creditosAprovados.valor.toLocaleString('pt-BR')}
              </p>
              <p className="text-sm text-gray-600">valor total aprovado</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${creditosAprovados.percentage}%` }}
                />
              </div>
              <span className="text-sm font-medium text-green-600">
                {creditosAprovados.percentage}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Créditos Reprovados */}
      <Card className="border-red-200">
        <CardHeader className="flex flex-row items-center space-y-0 pb-2">
          <div className="flex items-center space-x-2">
            <XCircle className="h-6 w-6 text-red-600" />
            <CardTitle className="text-red-700">Créditos Reprovados</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <p className="text-3xl font-bold text-red-600">
                {creditosReprovados.quantidade.toLocaleString('pt-BR')}
              </p>
              <p className="text-sm text-gray-600">títulos reprovados</p>
            </div>
            
            <div>
              <p className="text-2xl font-semibold text-red-600">
                R$ {creditosReprovados.valor.toLocaleString('pt-BR')}
              </p>
              <p className="text-sm text-gray-600">valor total reprovado</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${creditosReprovados.percentage}%` }}
                />
              </div>
              <span className="text-sm font-medium text-red-600">
                {creditosReprovados.percentage}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    {/* Motivos de Recusa */}
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <AlertTriangle className="h-6 w-6 text-orange-600" />
          <CardTitle className="text-eucalyptus-dark">Motivos de Recusa</CardTitle>
        </div>
        <p className="text-sm text-gray-600">
          Detalhamento dos critérios que resultaram na reprovação dos créditos
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {motivosRecusa.map((motivo, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-900 flex-1 pr-4">
                  {motivo.motivo}
                </h4>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {motivo.quantidade} títulos
                  </p>
                  <p className="text-sm text-gray-600">
                    {motivo.percentage}% do total reprovado
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${motivo.percentage}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 w-12">
                  {motivo.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
        
        {/* Resumo Total */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-900">Total de Recusas:</span>
            <span className="font-bold text-red-600">
              {motivosRecusa.reduce((acc, curr) => acc + curr.quantidade, 0)} títulos
            </span>
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Métricas Adicionais */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4 text-center">
          <p className="text-sm text-gray-600">Taxa de Aprovação</p>
          <p className="text-xl font-bold text-eucalyptus-dark">75.5%</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 text-center">
          <p className="text-sm text-gray-600">Valor Médio Aprovado</p>
          <p className="text-xl font-bold text-eucalyptus-dark">R$ 530</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 text-center">
          <p className="text-sm text-gray-600">Concentração Máxima</p>
          <p className="text-xl font-bold text-eucalyptus-dark">8.5%</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 text-center">
          <p className="text-sm text-gray-600">Prazo Médio Aprovado</p>
          <p className="text-xl font-bold text-eucalyptus-dark">98 dias</p>
        </CardContent>
      </Card>
    </div>
  </div>
  </>
);
}
  


export default AnaliseEstatistica;
