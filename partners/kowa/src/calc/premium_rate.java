package partners.kowa.src.calc;

/**
 * 光和サービス向け: 時間外割増率（法定超 30%）。
 * work-item:ISS-82
 */
public class premium_rate {
    // L88-95: 光和独自上乗せ（標準 1.25 → 1.30）
    public static double overtimeRate() {
        return 1.30; // 法定25%に対し +5pt = 30%
    }

    public static double nightRate() {
        return 1.25; // 深夜は法定どおり
    }
}
