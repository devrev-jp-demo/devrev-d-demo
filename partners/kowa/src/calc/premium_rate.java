package partners.kowa.calc;

/** 時間外割増率の計算。 */
public class PremiumRate {
    public static final double LEGAL_OT = 0.25;
    public static final double KOWA_OT = 0.30;
    public double overtimeRate() { return KOWA_OT; }
}
