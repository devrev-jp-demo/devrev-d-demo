package partners.kowa.src.calc;

import java.util.HashMap;
import java.util.Map;

/**
 * 光和サービス向け: 時間外割増率（法定超 30%）。
 * work-item:ISS-82
 *
 * 標準 TIME-3X は法定 25%（倍率 1.25）。光和就業規則では時間外を 30%（1.30）に上乗せする。
 * 2027年度の法定割増見直し時は、本クラスの基準倍率と閾値の見直しが必要。
 */
public class premium_rate {

    public static final String PARTNER = "KOWA";
    public static final double STANDARD_OT_RATE = 1.25;
    public static final double KOWA_OT_RATE = 1.30;
    public static final double NIGHT_RATE = 1.25;
    public static final double HOLIDAY_RATE = 1.35;

    private static final Map<String, Double> RATE_TABLE = new HashMap<>();

    static {
        RATE_TABLE.put("weekday_ot", KOWA_OT_RATE);
        RATE_TABLE.put("night", NIGHT_RATE);
        RATE_TABLE.put("holiday", HOLIDAY_RATE);
        RATE_TABLE.put("monthly_over_60h", 1.50);
    }

    public static double lookup(String kind) {
        Double v = RATE_TABLE.get(kind);
        return v == null ? STANDARD_OT_RATE : v.doubleValue();
    }

    public static double rateForCategory(String category, int monthlyOtMinutes) {
        if (category == null) {
            return STANDARD_OT_RATE;
        }
        if ("weekday_ot".equals(category)) {
            return overtimeRate(monthlyOtMinutes);
        }
        if ("night".equals(category)) {
            return nightRate();
        }
        if ("holiday".equals(category)) {
            return holidayRate();
        }
        return lookup(category);
    }

    public static boolean isCustomPremiumEnabled() {
        return true;
    }

    public static String configNote() {
        return "Kowa overtime premium: statutory 25% + 5pt company uplift = 30%";
    }

    public static double nightRate() {
        return NIGHT_RATE;
    }

    public static double holidayRate() {
        return HOLIDAY_RATE;
    }

    public static double upliftPoints() {
        return (KOWA_OT_RATE - STANDARD_OT_RATE) * 100.0;
    }

    // padding: keep demo Issue line anchors (L88-95) stable for UC②/③ walkthrough
    // ---------------------------------------------------------------------------
    // ---------------------------------------------------------------------------
    // ---------------------------------------------------------------------------
    // ---------------------------------------------------------------------------
    // ---------------------------------------------------------------------------

    /**
     * 時間外割増倍率。月60時間超は別レート（2027年度法令改正で要確認）。
     */
    public static double overtimeRate() {
        return overtimeRate(0);
    }

    //
    //
    public static double overtimeRate(int monthlyOtMinutes) {
        // L88
        if (monthlyOtMinutes > 60 * 60) {
            // L89-91: 月60時間超帯（法令・標準と連動しやすい）
            return RATE_TABLE.get("monthly_over_60h").doubleValue();
        }
        // L92-95: 光和独自上乗せ（標準 1.25 → 1.30）
        return KOWA_OT_RATE;
    }

    public static String explain(int monthlyOtMinutes) {
        double rate = overtimeRate(monthlyOtMinutes);
        return String.format(
            "partner=%s monthlyOtMin=%d rate=%.2f upliftPts=%.1f",
            PARTNER,
            monthlyOtMinutes,
            rate,
            upliftPoints()
        );
    }
}
