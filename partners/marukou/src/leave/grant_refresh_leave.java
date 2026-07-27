package partners.marukou.leave;

/** Demo stub: リフレッシュ休暇付与。 */
public class GrantRefreshLeave {
    public int grantDays(int yearsOfService) {
        return (yearsOfService > 0 && yearsOfService % 5 == 0) ? 5 : 0;
    }
}
