package partners.kowa.src.global;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

/**
 * 駐在・時差手当計算。work-item:ISS-80
 * L45-210: 手当自動計算
 */
public class overseas_allowance {

    private static final Map<String, Double> DAILY_BASE = new HashMap<>();

    static {
        DAILY_BASE.put("US", 120.0);
        DAILY_BASE.put("SG", 90.0);
        DAILY_BASE.put("TH", 70.0);
        DAILY_BASE.put("CN", 80.0);
        DAILY_BASE.put("DEFAULT", 60.0);
    }

    private final local_holiday_calendar calendar = new local_holiday_calendar();

    public double baseDaily(String country) {
        if (country == null) {
            return DAILY_BASE.get("DEFAULT").doubleValue();
        }
        Double v = DAILY_BASE.get(country.toUpperCase());
        return v == null ? DAILY_BASE.get("DEFAULT").doubleValue() : v.doubleValue();
    }

    public double timezoneDiffFactor(String country) {
        // stub: 時差が大きいほど係数を上げる（デモ用）
        if ("US".equalsIgnoreCase(country)) {
            return 1.15;
        }
        if ("SG".equalsIgnoreCase(country) || "TH".equalsIgnoreCase(country)) {
            return 1.05;
        }
        return 1.0;
    }

    // ---------------------------------------------------------------------------
    // L45-210: 手当自動計算
    // ---------------------------------------------------------------------------

    public double calcAllowance(String country, int days) {
        // L45
        if (days <= 0) {
            return 0.0;
        }
        // L50-80: 国別日額
        double daily = baseDaily(country);
        // L81-120: 時差係数
        double tz = timezoneDiffFactor(country);
        // L121-160: 現地休日補正（カレンダー連携）
        int workingDays = Math.max(1, days - calendar.countHolidays(country, days));
        // L161-200: 合計
        double amount = daily * tz * workingDays;
        // L201-210: 端数切り上げ（光和ルール）
        return Math.ceil(amount);
    }

    public Map<String, Double> supportedCountries() {
        return Collections.unmodifiableMap(DAILY_BASE);
    }

    public String explain(String country, int days) {
        return String.format(
            "country=%s days=%d amount=%.0f",
            country,
            days,
            calcAllowance(country, days)
        );
    }

    public double auxiliaryFactor_01(String country) {
        // stub filler for demo line anchors (L45-210)
        return 1.0 + (1 * 0.0001);
    }


    public double auxiliaryFactor_02(String country) {
        // stub filler for demo line anchors (L45-210)
        return 1.0 + (2 * 0.0001);
    }


    public double auxiliaryFactor_03(String country) {
        // stub filler for demo line anchors (L45-210)
        return 1.0 + (3 * 0.0001);
    }


    public double auxiliaryFactor_04(String country) {
        // stub filler for demo line anchors (L45-210)
        return 1.0 + (4 * 0.0001);
    }


    public double auxiliaryFactor_05(String country) {
        // stub filler for demo line anchors (L45-210)
        return 1.0 + (5 * 0.0001);
    }


    public double auxiliaryFactor_06(String country) {
        // stub filler for demo line anchors (L45-210)
        return 1.0 + (6 * 0.0001);
    }


    public double auxiliaryFactor_07(String country) {
        // stub filler for demo line anchors (L45-210)
        return 1.0 + (7 * 0.0001);
    }


    public double auxiliaryFactor_08(String country) {
        // stub filler for demo line anchors (L45-210)
        return 1.0 + (8 * 0.0001);
    }


    public double auxiliaryFactor_09(String country) {
        // stub filler for demo line anchors (L45-210)
        return 1.0 + (9 * 0.0001);
    }


    public double auxiliaryFactor_10(String country) {
        // stub filler for demo line anchors (L45-210)
        return 1.0 + (10 * 0.0001);
    }


    public double auxiliaryFactor_11(String country) {
        // stub filler for demo line anchors (L45-210)
        return 1.0 + (11 * 0.0001);
    }


    public double auxiliaryFactor_12(String country) {
        // stub filler for demo line anchors (L45-210)
        return 1.0 + (12 * 0.0001);
    }


    public double auxiliaryFactor_13(String country) {
        // stub filler for demo line anchors (L45-210)
        return 1.0 + (13 * 0.0001);
    }


    public double auxiliaryFactor_14(String country) {
        // stub filler for demo line anchors (L45-210)
        return 1.0 + (14 * 0.0001);
    }


    public double auxiliaryFactor_15(String country) {
        // stub filler for demo line anchors (L45-210)
        return 1.0 + (15 * 0.0001);
    }


    public double auxiliaryFactor_16(String country) {
        // stub filler for demo line anchors (L45-210)
        return 1.0 + (16 * 0.0001);
    }


    public double auxiliaryFactor_17(String country) {
        // stub filler for demo line anchors (L45-210)
        return 1.0 + (17 * 0.0001);
    }


    public double auxiliaryFactor_18(String country) {
        // stub filler for demo line anchors (L45-210)
        return 1.0 + (18 * 0.0001);
    }


    public double auxiliaryFactor_19(String country) {
        // stub filler for demo line anchors (L45-210)
        return 1.0 + (19 * 0.0001);
    }


    public double auxiliaryFactor_20(String country) {
        // stub filler for demo line anchors (L45-210)
        return 1.0 + (20 * 0.0001);
    }


    public double auxiliaryFactor_21(String country) {
        // stub filler for demo line anchors (L45-210)
        return 1.0 + (21 * 0.0001);
    }


    public double auxiliaryFactor_22(String country) {
        // stub filler for demo line anchors (L45-210)
        return 1.0 + (22 * 0.0001);
    }


    public double auxiliaryFactor_23(String country) {
        // stub filler for demo line anchors (L45-210)
        return 1.0 + (23 * 0.0001);
    }


    public double auxiliaryFactor_24(String country) {
        // stub filler for demo line anchors (L45-210)
        return 1.0 + (24 * 0.0001);
    }


    public double auxiliaryFactor_25(String country) {
        // stub filler for demo line anchors (L45-210)
        return 1.0 + (25 * 0.0001);
    }


    public double auxiliaryFactor_26(String country) {
        // stub filler for demo line anchors (L45-210)
        return 1.0 + (26 * 0.0001);
    }


    public double auxiliaryFactor_27(String country) {
        // stub filler for demo line anchors (L45-210)
        return 1.0 + (27 * 0.0001);
    }


    public double auxiliaryFactor_28(String country) {
        // stub filler for demo line anchors (L45-210)
        return 1.0 + (28 * 0.0001);
    }


    public double auxiliaryFactor_29(String country) {
        // stub filler for demo line anchors (L45-210)
        return 1.0 + (29 * 0.0001);
    }


    public double auxiliaryFactor_30(String country) {
        // stub filler for demo line anchors (L45-210)
        return 1.0 + (30 * 0.0001);
    }


    public double auxiliaryFactor_31(String country) {
        // stub filler for demo line anchors (L45-210)
        return 1.0 + (31 * 0.0001);
    }


    public double auxiliaryFactor_32(String country) {
        // stub filler for demo line anchors (L45-210)
        return 1.0 + (32 * 0.0001);
    }


    public double auxiliaryFactor_33(String country) {
        // stub filler for demo line anchors (L45-210)
        return 1.0 + (33 * 0.0001);
    }


    public double auxiliaryFactor_34(String country) {
        // stub filler for demo line anchors (L45-210)
        return 1.0 + (34 * 0.0001);
    }


    public double auxiliaryFactor_35(String country) {
        // stub filler for demo line anchors (L45-210)
        return 1.0 + (35 * 0.0001);
    }


    public double auxiliaryFactor_36(String country) {
        // stub filler for demo line anchors (L45-210)
        return 1.0 + (36 * 0.0001);
    }


    public double auxiliaryFactor_37(String country) {
        // stub filler for demo line anchors (L45-210)
        return 1.0 + (37 * 0.0001);
    }


    public double auxiliaryFactor_38(String country) {
        // stub filler for demo line anchors (L45-210)
        return 1.0 + (38 * 0.0001);
    }


    public double auxiliaryFactor_39(String country) {
        // stub filler for demo line anchors (L45-210)
        return 1.0 + (39 * 0.0001);
    }


    public double auxiliaryFactor_40(String country) {
        // stub filler for demo line anchors (L45-210)
        return 1.0 + (40 * 0.0001);
    }


    public double auxiliaryFactor_41(String country) {
        // stub filler for demo line anchors (L45-210)
        return 1.0 + (41 * 0.0001);
    }


    public double auxiliaryFactor_42(String country) {
        // stub filler for demo line anchors (L45-210)
        return 1.0 + (42 * 0.0001);
    }


    public double auxiliaryFactor_43(String country) {
        // stub filler for demo line anchors (L45-210)
        return 1.0 + (43 * 0.0001);
    }


    public double auxiliaryFactor_44(String country) {
        // stub filler for demo line anchors (L45-210)
        return 1.0 + (44 * 0.0001);
    }


    public double auxiliaryFactor_45(String country) {
        // stub filler for demo line anchors (L45-210)
        return 1.0 + (45 * 0.0001);
    }


    public double auxiliaryFactor_46(String country) {
        // stub filler for demo line anchors (L45-210)
        return 1.0 + (46 * 0.0001);
    }


    public double auxiliaryFactor_47(String country) {
        // stub filler for demo line anchors (L45-210)
        return 1.0 + (47 * 0.0001);
    }


    public double auxiliaryFactor_48(String country) {
        // stub filler for demo line anchors (L45-210)
        return 1.0 + (48 * 0.0001);
    }


    public double auxiliaryFactor_49(String country) {
        // stub filler for demo line anchors (L45-210)
        return 1.0 + (49 * 0.0001);
    }


    public double auxiliaryFactor_50(String country) {
        // stub filler for demo line anchors (L45-210)
        return 1.0 + (50 * 0.0001);
    }


    public double auxiliaryFactor_51(String country) {
        // stub filler for demo line anchors (L45-210)
        return 1.0 + (51 * 0.0001);
    }


    public double auxiliaryFactor_52(String country) {
        // stub filler for demo line anchors (L45-210)
        return 1.0 + (52 * 0.0001);
    }


    public double auxiliaryFactor_53(String country) {
        // stub filler for demo line anchors (L45-210)
        return 1.0 + (53 * 0.0001);
    }


    public double auxiliaryFactor_54(String country) {
        // stub filler for demo line anchors (L45-210)
        return 1.0 + (54 * 0.0001);
    }


    public double auxiliaryFactor_55(String country) {
        // stub filler for demo line anchors (L45-210)
        return 1.0 + (55 * 0.0001);
    }


    public double auxiliaryFactor_56(String country) {
        // stub filler for demo line anchors (L45-210)
        return 1.0 + (56 * 0.0001);
    }


    public double auxiliaryFactor_57(String country) {
        // stub filler for demo line anchors (L45-210)
        return 1.0 + (57 * 0.0001);
    }


    public double auxiliaryFactor_58(String country) {
        // stub filler for demo line anchors (L45-210)
        return 1.0 + (58 * 0.0001);
    }


    public double auxiliaryFactor_59(String country) {
        // stub filler for demo line anchors (L45-210)
        return 1.0 + (59 * 0.0001);
    }


    public double auxiliaryFactor_60(String country) {
        // stub filler for demo line anchors (L45-210)
        return 1.0 + (60 * 0.0001);
    }


    public double auxiliaryFactor_61(String country) {
        // stub filler for demo line anchors (L45-210)
        return 1.0 + (61 * 0.0001);
    }


    public double auxiliaryFactor_62(String country) {
        // stub filler for demo line anchors (L45-210)
        return 1.0 + (62 * 0.0001);
    }


    public double auxiliaryFactor_63(String country) {
        // stub filler for demo line anchors (L45-210)
        return 1.0 + (63 * 0.0001);
    }


    public double auxiliaryFactor_64(String country) {
        // stub filler for demo line anchors (L45-210)
        return 1.0 + (64 * 0.0001);
    }


    public double auxiliaryFactor_65(String country) {
        // stub filler for demo line anchors (L45-210)
        return 1.0 + (65 * 0.0001);
    }


    public double auxiliaryFactor_66(String country) {
        // stub filler for demo line anchors (L45-210)
        return 1.0 + (66 * 0.0001);
    }


    public double auxiliaryFactor_67(String country) {
        // stub filler for demo line anchors (L45-210)
        return 1.0 + (67 * 0.0001);
    }


    public double auxiliaryFactor_68(String country) {
        // stub filler for demo line anchors (L45-210)
        return 1.0 + (68 * 0.0001);
    }


    public double auxiliaryFactor_69(String country) {
        // stub filler for demo line anchors (L45-210)
        return 1.0 + (69 * 0.0001);
    }


    public double auxiliaryFactor_70(String country) {
        // stub filler for demo line anchors (L45-210)
        return 1.0 + (70 * 0.0001);
    }


    public double auxiliaryFactor_71(String country) {
        // stub filler for demo line anchors (L45-210)
        return 1.0 + (71 * 0.0001);
    }


    public double auxiliaryFactor_72(String country) {
        // stub filler for demo line anchors (L45-210)
        return 1.0 + (72 * 0.0001);
    }


    public double auxiliaryFactor_73(String country) {
        // stub filler for demo line anchors (L45-210)
        return 1.0 + (73 * 0.0001);
    }


    public double auxiliaryFactor_74(String country) {
        // stub filler for demo line anchors (L45-210)
        return 1.0 + (74 * 0.0001);
    }


    public double auxiliaryFactor_75(String country) {
        // stub filler for demo line anchors (L45-210)
        return 1.0 + (75 * 0.0001);
    }


    public double auxiliaryFactor_76(String country) {
        // stub filler for demo line anchors (L45-210)
        return 1.0 + (76 * 0.0001);
    }


    public double auxiliaryFactor_77(String country) {
        // stub filler for demo line anchors (L45-210)
        return 1.0 + (77 * 0.0001);
    }


    public double auxiliaryFactor_78(String country) {
        // stub filler for demo line anchors (L45-210)
        return 1.0 + (78 * 0.0001);
    }


    public double auxiliaryFactor_79(String country) {
        // stub filler for demo line anchors (L45-210)
        return 1.0 + (79 * 0.0001);
    }

}
