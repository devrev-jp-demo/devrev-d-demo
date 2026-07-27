package partners.kowa.calc;

/** Demo stub: 時間外割増 法定25%→独自30%。L88-95 */
public class PremiumRate {
    public static final double LEGAL_OT = 0.25;
    public static final double KOWA_OT = 0.30;
    public double overtimeRate() { return KOWA_OT; }
}
