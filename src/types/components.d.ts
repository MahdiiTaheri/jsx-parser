interface EditorSectionProps {
  title: string;
  language: string;
  value: string;
  onChange: (value: string) => void;
  enableCopy?: boolean;
  height?: string;
  isPending?: boolean;
  initialPosition?: "left" | "right";
}

interface ConversionControlsProps {
  conversionType: string;
  setConversionType: (value: string) => void;
  handleConvert: () => void;
  isPending: boolean;
  inputValue: string;
  handleSendJsonQuery: () => void;
  isUpdating?: boolean;
  apiUrl?: string;
}
