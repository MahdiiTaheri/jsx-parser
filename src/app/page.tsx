import * as motion from "motion/react-client";
import Convert from "@/components/Convert";

const ConverterPage = () => {
  // const [apiUrl, setApiUrl] = useState<string>("");
  // const { updatePage, isUpdating } = usePageUpdate(apiUrl, output);

  // const handleSendJsonQuery = useCallback(() => {
  //   updatePage();
  // }, [updatePage]);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4">
      <motion.h1
        className="text-2xl lg:text-4xl font-bold text-sky-400 text-center mb-4 mt-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        JSX & JSON Converter
      </motion.h1>

      {/* <label htmlFor="apiUrl" className="block mb-1">
          Route
        </label>
        <input
          id="apiUrl"
          type="text"
          value={apiUrl}
          disabled={true}
          onChange={(e) => setApiUrl(e.target.value)}
          className="w-full max-w-lg p-2 rounded-lg bg-slate-800 text-white cursor-not-allowed"
        /> */}
      <Convert />
    </div>
  );
};

export default ConverterPage;
