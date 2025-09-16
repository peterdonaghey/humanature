import {useLanguage} from "../contexts/LanguageContext";

export const CalendarEmbed = () => {
  const {language} = useLanguage();
  return (
    <>
      <div className="text-center items-center w-full pt-8">
        <p className="text-lg">Calendar</p>
      </div>
      {/* Desktop Calendar - Month View */}
      <iframe
        src={`https://calendar.google.com/calendar/embed?src=c76797a0bd842747eb7dfa50aa9302a7f3d6374b4e887609a5b3c7718988ffde%40group.calendar.google.com&ctz=Europe%2FLondon&mode=MONTH&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=1&showTz=0&hl=${language}`}
        title="Quinta do Amanhã Calendar"
        className="border-0 hidden md:block"
        width="90%"
        height="800"
      ></iframe>

      {/* Mobile Calendar - Agenda View */}
      <iframe
        src={`https://calendar.google.com/calendar/embed?src=c76797a0bd842747eb7dfa50aa9302a7f3d6374b4e887609a5b3c7718988ffde%40group.calendar.google.com&ctz=Europe%2FLondon&mode=AGENDA&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=1&showTz=0&hl=${language}`}
        title="Quinta do Amanhã Calendar"
        className="border-0 block md:hidden"
        width="100%"
        height="600"
      ></iframe>
      <div className="text-center mt-4 mb-8">
        <p className="text-sm text-gray-600">
          Calendar ID:
          c76797a0bd842747eb7dfa50aa9302a7f3d6374b4e887609a5b3c7718988ffde@group.calendar.google.com
        </p>
      </div>
    </>
  );
};
