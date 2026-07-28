package partners.kowa.src.calc;

import java.util.ArrayList;
import java.util.List;

/**
 * 光和: 月次時間外の集計と割増適用の入り口。
 * work-item:ISS-82
 */
public class monthly_ot_aggregator {

    public static class OtSlice {
        public final String category;
        public final int minutes;

        public OtSlice(String category, int minutes) {
            this.category = category;
            this.minutes = minutes;
        }
    }

    private final List<OtSlice> slices = new ArrayList<>();

    public void add(String category, int minutes) {
        if (minutes <= 0) {
            return;
        }
        slices.add(new OtSlice(category, minutes));
    }

    public int totalMinutes() {
        int sum = 0;
        for (OtSlice s : slices) {
            sum += s.minutes;
        }
        return sum;
    }

    /**
     * 各スライスに premium_rate を適用した加重分（分×倍率）の合計。
     */
    public double weightedPremiumUnits() {
        int total = totalMinutes();
        double units = 0.0;
        for (OtSlice s : slices) {
            double rate = premium_rate.rateForCategory(s.category, total);
            units += s.minutes * rate;
        }
        return units;
    }

    public String summary() {
        return "kowa ot totalMin=" + totalMinutes()
            + " weighted=" + weightedPremiumUnits()
            + " note=" + premium_rate.configNote();
    }
}
