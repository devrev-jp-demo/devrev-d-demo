package partners.kowa.src.global;

import java.util.HashMap;
import java.util.Map;

/** 拠点タイムゾーン差分（スタブ）。work-item:ISS-80 */
public class TimezoneOffsetTable {

    private static final Map<String, Integer> OFFSET_HOURS = new HashMap<>();

    static {
        OFFSET_HOURS.put("JP", 9);
        OFFSET_HOURS.put("US", -5);
        OFFSET_HOURS.put("SG", 8);
        OFFSET_HOURS.put("TH", 7);
        OFFSET_HOURS.put("CN", 8);
    }

    public static int offsetHours(String country) {
        Integer v = OFFSET_HOURS.get(country == null ? "" : country.toUpperCase());
        return v == null ? 0 : v.intValue();
    }

    public static int diffFromJapan(String country) {
        return offsetHours(country) - offsetHours("JP");
    }
}
