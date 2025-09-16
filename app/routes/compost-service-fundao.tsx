import {Layout} from "../components/Layout";
import {useLanguage} from "../contexts/LanguageContext";

export default function CompostServiceFundao() {
  const {language} = useLanguage();

  const compostableItems = [
    {
      icon: "🥬",
      ptText: "Tudo vegetal ou fruta",
      enText: "All vegetables and fruits",
    },
    {
      icon: "☕️",
      ptText: "Borra de café",
      enText: "Coffee grounds",
    },
    {
      icon: "🫖",
      ptText: "Folhas de chá",
      enText: "Tea leaves",
    },
    {
      icon: "🥚",
      ptText: "Casca de ovo",
      enText: "Eggshells",
    },
    {
      icon: "🍂",
      ptText: "Folhas",
      enText: "Leaves",
    },
    {
      icon: "🌾",
      ptText: "Grama e palha",
      enText: "Grass and straw",
    },
    {
      icon: "🫒",
      ptText: "Óleo vegetal",
      enText: "Vegetable oil",
    },
    {
      icon: "📄",
      ptText: "Papel e cartão não impresso",
      enText: "Non-printed paper and cardboard",
    },
  ];

  const nonCompostableItems = [
    {
      icon: "⛔",
      ptText: "Tudo não bio-degradavel",
      enText: "All non-biodegradable items",
    },
    {
      icon: "🚫",
      ptText: "Plásticos, vidro, metal etc.",
      enText: "Plastics, glass, metal etc.",
    },
    {
      icon: "🖨️",
      ptText: "Papel impresso",
      enText: "Printed paper",
    },
    {
      icon: "👎",
      ptText: "Sacos de chá sintéticos",
      enText: "Synthetic tea bags",
    },
    {
      icon: "🏷️",
      ptText: "Etiquetas de fruta",
      enText: "Fruit labels",
    },
    {
      icon: "🥩",
      ptText: "Carne",
      enText: "Meat",
    },
    {
      icon: "🧀",
      ptText: "Lacticínios e ovo processada",
      enText: "Dairy and processed eggs",
    },
    {
      icon: "🏭",
      ptText: "Comida muito processada",
      enText: "Heavily processed food",
    },
  ];

  const heroSection = {
    ptText: {
      title: "Compostagem",
      subtitle: "Transformando Resíduos em Vida",
    },
    enText: {
      title: "Composting",
      subtitle: "Transforming Waste into Life",
    },
  };

  const welcomeSection = {
    ptText: {
      title: "Serviço de Compostagem do Fundão",
      paragraph1:
        "Obrigada por aderir ao serviço de compostagem do Fundão. Um projeto com a missão de criar um mundo mais feliz e saudável. Não poderíamos fazê-lo sem você!",
      paragraph2:
        "O projeto Serviço de Compostagem do Fundão é totalmente gerido por voluntários e estamos gratos pela sua ajuda e compaixão pelo projeto. Por isso, pedimos a sua compreensão para quaisquer melhorias que ainda precisamos fazer.",
    },
    enText: {
      title: "Compost Service Fundão",
      paragraph1:
        "Thank you for joining the Fundão composting service. A project with the mission to create a happier and healthier world. We couldn't do it without you!",
      paragraph2:
        "The Fundão Composting Service project is entirely volunteer-run and we are grateful for your help and compassion for the project. Therefore, we ask for your understanding for any improvements we still need to make.",
    },
  };

  const organicCycleSection = {
    ptText: {
      paragraph1:
        "As plantas retiram nutrientes do solo para criar alimentos. Nós comemos esses alimentos e produzimos resíduos orgânicos, que contêm os mesmos nutrientes que as plantas retiraram do solo.",
      paragraph2:
        "A compostagem transforma resíduos orgânicos em um solo rico em nutrientes, necessário para a produção de alimentos. Ao compostar, também reduzimos os resíduos em aterros e diminuímos as emissões de gases de efeito estufa.",
      paragraph3:
        "Aplicar composto à terra enriquece o solo com nutrientes essenciais, melhora a estrutura do solo e conserva água, aumentando a capacidade de retenção de água do solo. Ao fornecer alimento para a vida do solo, o composto tem o poder de transformar terras secas, mortas e desérticas em um solo negro, saudável e exuberante. Sem necessidade de fertilizantes químicos!",
    },
    enText: {
      paragraph1:
        "Plants take nutrients from the soil to create food. We eat this food and produce organic waste, which contains the same nutrients that plants took from the soil.",
      paragraph2:
        "Composting transforms organic waste into nutrient-rich soil, necessary for food production. By composting, we also reduce landfill waste and decrease greenhouse gas emissions.",
      paragraph3:
        "Applying compost to the land enriches the soil with essential nutrients, improves soil structure, and conserves water by increasing the soil's water retention capacity. By providing food for soil life, compost has the power to transform dry, dead and desert lands into black, healthy and lush soil. No need for chemical fertilizers!",
    },
  };

  const howItWorksSection = {
    ptText: {
      title: "Como Funciona",
      step1: "Leve os baldes vazios para casa",
      step2: "Encha os baldes com lixo orgânico",
      step3: "Tragam de volta os baldes cheios",
    },
    enText: {
      title: "How It Works",
      step1: "Take empty buckets home",
      step2: "Fill buckets with organic waste",
      step3: "Bring back full buckets",
    },
  };

  const quintaSection = {
    ptText: {
      title: "A Quinta do Amanhã",
      paragraph1:
        "O material orgânico é recolhido em baldes e transportado para a Quinta do Amanhã, uma quinta nos arredores da cidade. A quinta é uma iniciativa da HumaNature, localizada perto do Fundão, na Coutada.",
      paragraph2:
        "A Quinta do Amanhã é uma quinta sem fins lucrativos com o objetivo de produzir alimentos de forma sustentável e fornecer educação sobre agricultura sustentável.",
      paragraph3:
        "Aqui começa o processo de compostagem. Uma série de pilhas de compostagem são montadas, monitorizadas e cuidadas, e em poucos meses o resíduo orgânico é completamente transformado. Onde antes se viam cascas de banana, caroços de maçã e vegetais mofados, agora existe apenas um solo rico e de cheiro fresco.",
    },
    enText: {
      title: "Quinta do Amanhã",
      paragraph1:
        "The organic material is collected in buckets and transported to Quinta do Amanhã, a farm on the outskirts of the city. The farm is a HumaNature initiative, located near Fundão, in Coutada.",
      paragraph2:
        "Quinta do Amanhã is a non-profit farm with the goal of producing food sustainably and providing education about sustainable agriculture.",
      paragraph3:
        "This is where the composting process begins. A series of compost piles are assembled, monitored, and cared for, and in a few months the organic waste is completely transformed. Where once there were banana peels, apple cores, and moldy vegetables, now there is only rich, fresh-smelling soil.",
    },
  };

  const serviceStatusSection = {
    ptText: {
      title: "🌱 Pausa para Respirar",
      message:
        "Hey pessoal! O nosso serviço de compostagem está a fazer uma pequena pausa neste momento. Estamos a reorganizar as coisas para voltar ainda melhor. Vamos dar um toque quando estivermos de volta! 🤙",
    },
    enText: {
      title: "🌱 Taking a Breather",
      message:
        "Hey folks! Our composting service is taking a little break right now. We're getting our act together to come back even better. We'll give you a shout when we're back up and running! 🤙",
    },
  };

  const locationSection = {
    ptText: {
      title: "📍 Onde Estamos?",
      message:
        "Por agora, não temos um ponto fixo para deixar os vossos restos orgânicos. Mas assim que voltarmos, vamos gritar bem alto onde nos podem encontrar! 📢",
    },
    enText: {
      title: "📍 Where Are We?",
      message:
        "Right now, we don't have a fixed spot to drop off your organic goodies. But as soon as we're back, we'll shout it from the rooftops where you can find us! 📢",
    },
  };

  const compostLabels = {
    ptText: {
      yes: "SIM",
      no: "NÃO",
    },
    enText: {
      yes: "YES",
      no: "NO",
    },
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            {language === "pt"
              ? heroSection.ptText.title
              : heroSection.enText.title}
          </h1>
          <p className="text-lg text-gray-600">
            {language === "pt"
              ? heroSection.ptText.subtitle
              : heroSection.enText.subtitle}
          </p>
        </div>

        {/* Welcome Section */}
        <div className="mb-16">
          <div className="bg-green-50 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-center mb-4">
              {language === "pt"
                ? welcomeSection.ptText.title
                : welcomeSection.enText.title}
            </h2>
            <p className="text-gray-700 text-center mb-4">
              {language === "pt"
                ? welcomeSection.ptText.paragraph1
                : welcomeSection.enText.paragraph1}
            </p>
            <p className="text-gray-700 text-center">
              {language === "pt"
                ? welcomeSection.ptText.paragraph2
                : welcomeSection.enText.paragraph2}
            </p>
          </div>
        </div>

        {/* Service Status Notice */}
        <div className="mb-16">
          <div className="bg-amber-50 border-l-4 border-amber-400 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-amber-800 mb-3">
              {language === "pt"
                ? serviceStatusSection.ptText.title
                : serviceStatusSection.enText.title}
            </h2>
            <p className="text-amber-700">
              {language === "pt"
                ? serviceStatusSection.ptText.message
                : serviceStatusSection.enText.message}
            </p>
          </div>
        </div>

        {/* Location Section */}
        <div className="mb-16">
          <div className="bg-blue-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-blue-800 mb-3">
              {language === "pt"
                ? locationSection.ptText.title
                : locationSection.enText.title}
            </h2>
            <p className="text-blue-700">
              {language === "pt"
                ? locationSection.ptText.message
                : locationSection.enText.message}
            </p>
          </div>
        </div>

        {/* Urban Organic Cycle */}
        <div className="mb-16">
          <img
            src="/organic-cycle.png"
            alt={
              language === "pt"
                ? "Ciclo Orgânico Urbano"
                : "Urban Organic Cycle"
            }
            className="mx-auto mb-6 max-w-md"
          />
          <div className="prose max-w-none">
            <p className="mb-4">
              {language === "pt"
                ? organicCycleSection.ptText.paragraph1
                : organicCycleSection.enText.paragraph1}
            </p>
            <p className="mb-4">
              {language === "pt"
                ? organicCycleSection.ptText.paragraph2
                : organicCycleSection.enText.paragraph2}
            </p>
            <p className="mb-4">
              {language === "pt"
                ? organicCycleSection.ptText.paragraph3
                : organicCycleSection.enText.paragraph3}
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="border-yellow-100 border-8 rounded-lg p-8 mb-16">
          <h2 className="text-2xl font-semibold mb-6">
            {language === "pt"
              ? howItWorksSection.ptText.title
              : howItWorksSection.enText.title}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">1</span>
              </div>
              <p>
                {language === "pt"
                  ? howItWorksSection.ptText.step1
                  : howItWorksSection.enText.step1}
              </p>
              <img
                src="/how-it-works-1.png"
                alt="Step 1"
                className="h-40 mx-auto"
              />
            </div>
            <div className="text-center">
              <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">2</span>
              </div>
              <p>
                {language === "pt"
                  ? howItWorksSection.ptText.step2
                  : howItWorksSection.enText.step2}
              </p>
              <img
                src="/how-it-works-2.png"
                alt="Step 2"
                className="h-40 mx-auto"
              />
            </div>
            <div className="text-center">
              <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">3</span>
              </div>
              <p>
                {language === "pt"
                  ? howItWorksSection.ptText.step3
                  : howItWorksSection.enText.step3}
              </p>
              <img
                src="/how-it-works-3.png"
                alt="Step 3"
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
              <span className="text-4xl">☺</span>
              {language === "pt"
                ? compostLabels.ptText.yes
                : compostLabels.enText.yes}
            </h3>
            <ul className="space-y-2">
              {compostableItems.map((item, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="text-4xl">{item.icon}</span>
                  {language === "pt" ? item.ptText : item.enText}
                </li>
              ))}
            </ul>
          </div>

          {/* What Cannot Be Composted */}
          <div className="bg-red-50 rounded-lg p-8">
            <h3 className="text-xl font-semibold mb-4 text-red-800 flex items-center gap-2">
              <span className="text-4xl">☹</span>
              {language === "pt"
                ? compostLabels.ptText.no
                : compostLabels.enText.no}
            </h3>
            <ul className="space-y-2">
              {nonCompostableItems.map((item, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="text-4xl">{item.icon}</span>
                  {language === "pt" ? item.ptText : item.enText}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Quinta do Amanhã Details */}
        <div className="bg-green-50 rounded-lg p-8 mb-16">
          <h2 className="text-2xl font-semibold mb-4">
            {language === "pt"
              ? quintaSection.ptText.title
              : quintaSection.enText.title}
          </h2>
          <p className="mb-4">
            {language === "pt"
              ? quintaSection.ptText.paragraph1
              : quintaSection.enText.paragraph1}
          </p>
          <p className="mb-4">
            {language === "pt"
              ? quintaSection.ptText.paragraph2
              : quintaSection.enText.paragraph2}
          </p>
          <p>
            {language === "pt"
              ? quintaSection.ptText.paragraph3
              : quintaSection.enText.paragraph3}
          </p>
        </div>
      </div>
    </Layout>
  );
}
