import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Download, FileDown } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { UserOptions } from 'jspdf-autotable';

// Extende o jsPDF para incluir autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: UserOptions) => jsPDF;
  }
}

interface Produto {
  codigo: string;
  descricao: string;
  quantidade: number;
  valor_unitario: number;
  valor_total: number;
  categoria: string;
}

interface PieChartData {
  name: string;
  value: number;
}

interface TabelaProdutosProps {
  produtos: Produto[];
}

const ReformaDashboard: React.FC = () => {
  const produtos: Produto[] = [
    // Nota 1
    { codigo: '32209', descricao: '3M LIXA MASSA P100', quantidade: 10.00, valor_unitario: 1.50, valor_total: 15.00, categoria: 'Acabamento' },
    { codigo: '98137', descricao: 'ADERE FITA AUTOMOTIVA 48X50 REF525 VERDE', quantidade: 2.00, valor_unitario: 24.00, valor_total: 48.00, categoria: 'Acabamento' },
    { codigo: '95492', descricao: 'ATLAS BANDEJA PRETA 2,7L', quantidade: 2.00, valor_unitario: 17.00, valor_total: 34.00, categoria: 'Ferramentas' },
    { codigo: '40023', descricao: 'ATLAS CABO GAIOLA 23CM 400/23SR', quantidade: 3.00, valor_unitario: 12.00, valor_total: 36.00, categoria: 'Ferramentas' },
    { codigo: '17510', descricao: 'ATLAS ESPATULA ACO 175-10', quantidade: 2.00, valor_unitario: 13.00, valor_total: 26.00, categoria: 'Ferramentas' },
    { codigo: '32110', descricao: 'ATLAS ROLO DE LA ANTI-GOTA 23 CM REF321/10', quantidade: 3.00, valor_unitario: 30.00, valor_total: 90.00, categoria: 'Ferramentas' },
    { codigo: '96722', descricao: 'ATLAS TRINCHA 396 2', quantidade: 3.00, valor_unitario: 10.00, valor_total: 30.00, categoria: 'Ferramentas' },
    { codigo: '10874', descricao: 'PAPEL P/ MASCARAMENTO AUTOMOTIVO 45 CM', quantidade: 1.00, valor_unitario: 26.00, valor_total: 26.00, categoria: 'Acabamento' },

    // Nota 2
    { codigo: '3347', descricao: 'MASSA CORRIDA PVA 3.6 EUCATEX', quantidade: 1.00, valor_unitario: 27.98, valor_total: 27.98, categoria: 'Acabamento' },
    { codigo: '656', descricao: 'CIMENTO CPII KILO', quantidade: 5.00, valor_unitario: 1.40, valor_total: 7.02, categoria: 'Material Construção' },

    // Nota 3
    { codigo: '003041', descricao: 'CAIXA PARA MASSA 20LTS', quantidade: 1.00, valor_unitario: 22.50, valor_total: 22.50, categoria: 'Ferramentas' },

    // Nota 4
    { codigo: '000802', descricao: 'ARGAMASSA 10 EM 1 VOTOMASSA', quantidade: 3.00, valor_unitario: 35.00, valor_total: 105.00, categoria: 'Material Construção' },
    { codigo: '008220', descricao: 'DESEMPENADEIRA PLAST 18 X 30 FRISADA SENI', quantidade: 1.00, valor_unitario: 14.00, valor_total: 14.00, categoria: 'Ferramentas' },
    { codigo: '022978', descricao: 'KILO DE CIMENTO', quantidade: 1.00, valor_unitario: 1.10, valor_total: 1.10, categoria: 'Material Construção' },

    // Notas 5 e 6 (Materiais elétricos)
    { codigo: '1234', descricao: 'PLACA 4X2 2P LIZ 7891435924534', quantidade: 6.00, valor_unitario: 7.00, valor_total: 42.00, categoria: 'Elétrica' },
    { codigo: '874', descricao: 'MODULO TOMADA 2P+T TRAMONTINA 10A', quantidade: 6.00, valor_unitario: 7.15, valor_total: 42.91, categoria: 'Elétrica' },

    // Nota 7
    { codigo: '03141', descricao: 'SUVINIL MASSA CORRIDA 5,7KG', quantidade: 1.00, valor_unitario: 42.00, valor_total: 42.00, categoria: 'Pintura' },

    // Nota 8
    { codigo: '95751', descricao: 'SUVINIL RESINA INCOLOR 3,6L', quantidade: 1.00, valor_unitario: 130.00, valor_total: 130.00, categoria: 'Pintura' },

    // Nota 9
    { codigo: '51871', descricao: 'GLASURIT LATEX FOTO ANTIGA 18LT', quantidade: 2.00, valor_unitario: 290.00, valor_total: 580.00, categoria: 'Pintura' },
    { codigo: '45155', descricao: 'SUVINIL LATEX CLASSICA TANGERINA 3,6L', quantidade: 1.00, valor_unitario: 135.00, valor_total: 135.00, categoria: 'Pintura' },
    { codigo: '21032', descricao: 'SUVINIL PISO CINZA ESCURO 18L', quantidade: 1.00, valor_unitario: 430.00, valor_total: 430.00, categoria: 'Pintura' }
  ];

  const categorias = [...new Set(produtos.map(p => p.categoria))];

  const totalPorCategoria = categorias.reduce<Record<string, number>>((acc, cat) => {
    acc[cat] = produtos
      .filter(p => p.categoria === cat)
      .reduce((sum, p) => sum + p.valor_total, 0);
    return acc;
  }, {});

  const totalGeral = produtos.reduce((sum, p) => sum + p.valor_total, 0);

  const pieChartData: PieChartData[] = Object.entries(totalPorCategoria).map(([categoria, valor]) => ({
    name: categoria,
    value: valor
  }));

  const CORES = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const downloadPDF = () => {
    import('jspdf').then(({ default: jsPDF }) => {
      import('jspdf-autotable').then(() => {
        const doc = new jsPDF();

        // Título do documento
        doc.setFontSize(16);
        doc.text('Relatório de Gastos - Reforma Espaço Calistenia', 14, 20);

        // Resumo financeiro
        doc.setFontSize(14);
        doc.text('Resumo por Categoria:', 14, 35);
        let yPos = 45;
        Object.entries(totalPorCategoria).forEach(([categoria, total]) => {
          doc.setFontSize(10);
          doc.text(`${categoria}: R$ ${total.toFixed(2)}`, 20, yPos);
          yPos += 7;
        });

        doc.setFontSize(12);
        doc.text(`Total Geral: R$ ${totalGeral.toFixed(2)}`, 14, yPos + 10);

        // Tabela de produtos
        doc.autoTable({
          startY: yPos + 20,
          head: [['Código', 'Descrição', 'Categoria', 'Qtd', 'Valor Unit.', 'Total']],
          body: produtos.map(produto => [
            produto.codigo,
            produto.descricao,
            produto.categoria,
            produto.quantidade.toString(),
            `R$ ${produto.valor_unitario.toFixed(2)}`,
            `R$ ${produto.valor_total.toFixed(2)}`
          ]),
          foot: [[
            { content: 'Total Geral:', colSpan: 5, styles: { halign: 'right', fontStyle: 'bold' } },
            { content: `R$ ${totalGeral.toFixed(2)}`, styles: { fontStyle: 'bold' } }
          ]],
          theme: 'grid',
          styles: { fontSize: 8 },
          headStyles: { fillColor: [66, 66, 66] }
        });

        // Salvar o PDF
        doc.save('relatorio-reforma.pdf');
      });
    });
  };

  const compartilharWhatsApp = () => {
    const mensagem = `Resumo dos gastos da reforma:
Total: R$ ${totalGeral.toFixed(2)}

Gastos por categoria:
${Object.entries(totalPorCategoria)
        .map(([cat, val]) => `${cat}: R$ ${val.toFixed(2)}`)
        .join('\n')}`;

    window.open(`https://wa.me/?text=${encodeURIComponent(mensagem)}`, '_blank');
  };

  const TabelaProdutos: React.FC<TabelaProdutosProps> = ({ produtos }) => {
    const totalTabela = produtos.reduce((sum, p) => sum + p.valor_total, 0);

    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left p-2">Código</th>
              <th className="text-left p-2">Descrição</th>
              <th className="text-left p-2">Categoria</th>
              <th className="text-right p-2">Qtd</th>
              <th className="text-right p-2">Valor Unit.</th>
              <th className="text-right p-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map((produto, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="p-2">{produto.codigo}</td>
                <td className="p-2">{produto.descricao}</td>
                <td className="p-2">{produto.categoria}</td>
                <td className="text-right p-2">{produto.quantidade}</td>
                <td className="text-right p-2">R$ {produto.valor_unitario.toFixed(2)}</td>
                <td className="text-right p-2">R$ {produto.valor_total.toFixed(2)}</td>
              </tr>
            ))}
            <tr className="bg-gray-50 font-bold">
              <td colSpan={5} className="p-2 text-right">Total:</td>
              <td className="p-2 text-right">R$ {totalTabela.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard de Gastos - Reforma Espaço Calistenia</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Gastos por Categoria</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: R$ ${value.toFixed(2)}`}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CORES[index % CORES.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resumo Financeiro</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(totalPorCategoria).map(([categoria, total]) => (
                    <div key={categoria} className="flex justify-between items-center">
                      <span className="text-gray-600">{categoria}</span>
                      <span className="font-semibold">R$ {total.toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold">Total Geral</span>
                      <span className="text-lg font-bold text-green-600">
                        R$ {totalGeral.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="todos" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="todos">Todos os Produtos</TabsTrigger>
              {categorias.map(categoria => (
                <TabsTrigger key={categoria} value={categoria}>{categoria}</TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="todos">
              <Card>
                <CardHeader>
                  <CardTitle>Todos os Produtos</CardTitle>
                </CardHeader>
                <CardContent>
                  <TabelaProdutos produtos={produtos} />
                </CardContent>
              </Card>
            </TabsContent>

            {categorias.map(categoria => (
              <TabsContent key={categoria} value={categoria}>
                <Card>
                  <CardHeader>
                    <CardTitle>{categoria}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TabelaProdutos produtos={produtos.filter(p => p.categoria === categoria)} />
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>

          <div className="flex justify-end gap-4 mt-8">
            <button
              onClick={downloadPDF}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              <FileDown className="w-4 h-4" />
              Baixar PDF
            </button>
            <button
              onClick={compartilharWhatsApp}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              <Download className="w-4 h-4" />
              Compartilhar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReformaDashboard;