package partners.kowa.src.global;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

/**
 * 現地カレンダー（祝日スタブ）。work-item:ISS-80
 */
public class local_holiday_calendar {

    private static final Set<String> US_FIXED = new HashSet<>(Arrays.asList(
        "01-01", "07-04", "12-25"
    ));
    private static final Set<String> SG_FIXED = new HashSet<>(Arrays.asList(
        "01-01", "08-09", "12-25"
    ));

    public boolean isHoliday(String country, String mmDd) {
        if (country == null || mmDd == null) {
            return false;
        }
        String c = country.toUpperCase();
        if ("US".equals(c)) {
            return US_FIXED.contains(mmDd);
        }
        if ("SG".equals(c)) {
            return SG_FIXED.contains(mmDd);
        }
        return false;
    }

    /**
     * 滞在日数に対する祝日概算（デモ用の粗いスタブ）。
     */
    public int countHolidays(String country, int stayDays) {
        if (stayDays <= 0) {
            return 0;
        }
        // およそ月1〜2日相当
        return Math.min(stayDays, stayDays / 15 + 1);
    }
}
