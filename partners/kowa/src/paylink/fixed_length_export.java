package partners.kowa.src.paylink;

/**
 * 光和: 給与計算連携の固定長エクスポート。
 * work-item:ISS-80（関連）/ 給与連携カスタム
 */
public class fixed_length_export {

    public static final int RECORD_LEN = 200;

    public String exportRow(String empId, double amount, String payDate) {
        StringBuilder sb = new StringBuilder(RECORD_LEN);
        sb.append(pad(empId, 12));
        sb.append(pad(String.format("%012.0f", amount * 100), 12));
        sb.append(pad(payDate == null ? "" : payDate, 8));
        while (sb.length() < RECORD_LEN) {
            sb.append(' ');
        }
        return sb.substring(0, RECORD_LEN);
    }

    private static String pad(String s, int len) {
        if (s == null) {
            s = "";
        }
        if (s.length() >= len) {
            return s.substring(0, len);
        }
        StringBuilder b = new StringBuilder(s);
        while (b.length() < len) {
            b.append(' ');
        }
        return b.toString();
    }
}
