package partners.kowa.src.paylink;

import java.util.HashMap;
import java.util.Map;

/** 光和側給与項目コード変換。 */
public class PayrollCodeMapper {

    private static final Map<String, String> MAP = new HashMap<>();

    static {
        MAP.put("OT_PREMIUM", "K-OT30");
        MAP.put("NIGHT", "K-NG25");
        MAP.put("HOLIDAY", "K-HD35");
        MAP.put("OVERSEAS_ALLOW", "K-OSAL");
    }

    public String toPartnerCode(String time3xCode) {
        String v = MAP.get(time3xCode);
        return v == null ? "K-UNK" : v;
    }
}
