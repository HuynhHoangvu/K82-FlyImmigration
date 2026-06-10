import Flag from "react-world-flags";

// Map từ key/value sang mã ISO quốc gia
const COUNTRY_ISO_MAP: Record<string, string> = {
  // Keys chuẩn (lowercase)
  australia: "AU",
  canada: "CA",
  new_zealand: "NZ",
  norway: "NO",
  germany: "DE",
  portugal: "PT",
  czech: "CZ",
  us: "US",
  uk: "GB",
  japan: "JP",
  singapore: "SG",
  south_korea: "KR",
  korea: "KR",
  taiwan: "TW",
  uae: "AE",
  vietnam: "VN",
  // Tên tiếng Anh
  "united states": "US",
  "united kingdom": "GB",
  "czech republic": "CZ",
  // Tên tiếng Việt
  úc: "AU",
  "na uy": "NO",
  đức: "DE",
  "bồ đào nha": "PT",
  séc: "CZ",
  mỹ: "US",
  "anh quốc": "GB",
  anh: "GB",
  "nhật bản": "JP",
  "hàn quốc": "KR",
  "đài loan": "TW",
  // Alias
  vn: "VN",
  vi: "VN",
  en: "US",
  "hoa kỳ": "US",
  "hoa ky": "US",
  nhật: "JP",
  hàn: "KR",
  đài: "TW",
  "tiểu vương quốc ả rập thống nhất": "AE",
};

interface CountryFlagProps {
  country: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function CountryFlag({ country, className, style }: CountryFlagProps) {
  if (!country) return null;
  
  // Chuẩn hóa input: lowercase và trim
  const normalizedCountry = country.toLowerCase().trim();
  
  // Tìm mã ISO từ map
  const code = COUNTRY_ISO_MAP[normalizedCountry] || 
               COUNTRY_ISO_MAP[country.toLowerCase()] ||
               country.toUpperCase();
  
  // Nếu không tìm thấy trong map, trả về null thay vì hiển thị sai
  if (!COUNTRY_ISO_MAP[normalizedCountry] && !COUNTRY_ISO_MAP[country.toLowerCase()]) {
    // Fallback: hiển thị text nếu không có cờ
    return (
      <span 
        className={className} 
        style={{ 
          fontSize: "0.75rem", 
          fontWeight: 600,
          ...style 
        }}
      >
        {country}
      </span>
    );
  }
  
  return (
    <Flag
      code={code}
      className={className}
      style={{
        width: "1.25rem",
        height: "auto",
        display: "inline-block",
        verticalAlign: "middle",
        borderRadius: "2px",
        objectFit: "cover",
        ...style,
      }}
    />
  );
}
