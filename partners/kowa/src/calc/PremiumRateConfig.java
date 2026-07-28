package partners.kowa.src.calc;

/**
 * 光和割増の設定値（マスタ相当のスタブ）。
 * work-item:ISS-82
 */
public final class PremiumRateConfig {

    private PremiumRateConfig() {}

    public static final int MONTHLY_OT_THRESHOLD_MINUTES = 60 * 60;
    public static final boolean APPLY_COMPANY_UPLIFT = true;
    public static final String EFFECTIVE_FROM = "2024-04-01";
    public static final String REVIEW_FOR_LAW_YEAR = "2027";

    public static boolean needsLawReview(String fiscalYear) {
        return REVIEW_FOR_LAW_YEAR.equals(fiscalYear);
    }
}
