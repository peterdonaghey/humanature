import {Layout} from "../components/Layout";

export default function Index() {
  const compostableItems = [
    {icon: "🥬", text: "Tudo vegetal ou fruta"},
    {icon: "☕️", text: "Borra de café"},
    {icon: "🫖", text: "Folhas de chá"},
    {icon: "🥚", text: "Casca de ovo"},
    {icon: "🍂", text: "Folhas"},
    {icon: "🌾", text: "Grama e palha"},
    {icon: "🫒", text: "Óleo vegetal"},
    {icon: "📄", text: "Papel e cartão não impresso"},
  ];

  const nonCompostableItems = [
    {icon: "⛔️", text: "Tudo não bio-degradavel"},
    {icon: "🚫", text: "Plásticos, vidro, metal etc."},
    {icon: "🖨️", text: "Papel impresso"},
    {icon: "👎", text: "Sacos de chá sintéticos"},
    {icon: "🏷️", text: "Etiquetas de fruta"},
    {icon: "🥩", text: "Carne"},
    {icon: "🧀", text: "Lacticínios e ovo processada"},
    {icon: "🏭", text: "Comida muito processada"},
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Compostagem</h1>
          <p className="text-lg text-gray-600">
            Transformando Resíduos em Vida
          </p>
        </div>

        {/* Quinta do Amanhã Section */}
        <div className="mb-16">
          <div className="bg-green-50 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-center mb-4">
              Bem-vindo ao Nosso Serviço de Compostagem
            </h2>
            <p className="text-gray-700 text-center mb-4">
              Obrigada por aderir ao serviço de compostagem do Fundão. Um
              projeto com a missão de criar um mundo mais feliz e saudável. Não
              poderíamos fazê-lo sem você!
            </p>
            <p className="text-gray-700 text-center">
              O projeto &quot;Serviço de Compostagem do Fundão&quot; é
              totalmente gerido por voluntários e estamos gratos pela sua ajuda
              e compaixão pelo projeto. Por isso, pedimos a sua compreensão para
              quaisquer melhorias que ainda precisamos fazer.
            </p>
          </div>
        </div>

        {/* Urban Organic Cycle */}
        <div className="mb-16">
          <img
            src="/organic-cycle.png"
            alt="Ciclo Orgânico Urbano"
            className="mx-auto mb-6 max-w-md"
          />
          <div className="prose max-w-none">
            <p className="mb-4">
              As plantas retiram nutrientes do solo para criar alimentos. Nós
              comemos esses alimentos e produzimos resíduos orgânicos, que
              contêm os mesmos nutrientes que as plantas retiraram do solo.
            </p>
            <p className="mb-4">
              A compostagem transforma resíduos orgânicos em um solo rico em
              nutrientes, necessário para a produção de alimentos. Ao compostar,
              também reduzimos os resíduos em aterros e diminuímos as emissões
              de gases de efeito estufa.
            </p>
            <p className="mb-4">
              Aplicar composto à terra enriquece o solo com nutrientes
              essenciais, melhora a estrutura do solo e conserva água,
              aumentando a capacidade de retenção de água do solo. Ao fornecer
              alimento para a vida do solo, o composto tem o poder de
              transformar terras secas, &quot;mortas&quot; e desérticas em um
              solo negro, saudável e exuberante. Sem necessidade de
              fertilizantes químicos!
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="border-yellow-100 border-8 rounded-lg p-8 mb-16">
          <h2 className="text-2xl font-semibold mb-6">Como Funciona</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">1</span>
              </div>
              <p>Leve os baldes vazios para casa</p>
              <img
                src="/how-it-works-1.png"
                alt="Como funciona 1"
                className="h-40 mx-auto"
              />
            </div>
            <div className="text-center">
              <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">2</span>
              </div>
              <p>Encha os baldes com lixo orgânico</p>
              <img
                src="/how-it-works-2.png"
                alt="Como funciona 2"
                className="h-40 mx-auto"
              />
            </div>
            <div className="text-center">
              <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">3</span>
              </div>
              <p>Tragam de volta os baldes cheios</p>
              <img
                src="/how-it-works-3.png"
                alt="Como funciona 3"
                className="h-40 mx-auto"
              />
            </div>
          </div>
        </div>

        {/* What Can & Cannot Be Composted */}
        <div className="grid md:grid-cols-2 gap-8 mb-16 text-xl">
          {/* What Can Be Composted */}
          <div className="bg-green-50 rounded-lg p-8">
            <h3 className="text-xl font-semibold mb-4 text-green-800 flex items-center gap-2">
              <span className="text-4xl">☺</span> SIM
            </h3>
            <ul className="space-y-2">
              {compostableItems.map((item, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="text-4xl">{item.icon}</span> {item.text}
                </li>
              ))}
            </ul>
          </div>

          {/* What Cannot Be Composted */}
          <div className="bg-red-50 rounded-lg p-8">
            <h3 className="text-xl font-semibold mb-4 text-red-800 flex items-center gap-2">
              <span className="text-4xl">☹</span>NÃO
            </h3>
            <ul className="space-y-2">
              {nonCompostableItems.map((item, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="text-4xl">{item.icon}</span> {item.text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* New Section: Quinta do Amanhã Details */}
        <div className="bg-green-50 rounded-lg p-8 mb-16">
          <h2 className="text-2xl font-semibold mb-4">A Quinta do Amanhã</h2>
          <p className="mb-4">
            O material orgânico é recolhido em baldes e transportado para a
            "Quinta do Amanhã," uma quinta nos arredores da cidade. A quinta é
            uma iniciativa da HumaNature, localizada perto do Fundão, na
            Coutada.
          </p>
          <p className="mb-4">
            A Quinta do Amanhã é uma quinta sem fins lucrativos com o objetivo
            de produzir alimentos de forma sustentável e fornecer educação sobre
            agricultura sustentável.
          </p>
          <p>
            Aqui começa o processo de compostagem. Uma série de pilhas de
            compostagem são montadas, monitorizadas e cuidadas, e em poucos
            meses o resíduo orgânico é completamente transformado. Onde antes se
            viam cascas de banana, caroços de maçã e vegetais mofados, agora
            existe apenas um solo rico e de cheiro fresco.
          </p>
        </div>
      </div>
    </Layout>
  );
}
