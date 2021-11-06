#include <bits/stdc++.h>

#include <cmath>

using namespace std;

// Long Long, Long Long -> Long Long
// produces value at coordinate
// forex: solve(5, 1) = 25
// forex: solve(2, 3) = 8
/*long long solve(long long x, long long y) {
    long long mx = max(x, y);
    if (mx % 2 == 0) {
        if (x == 1) {
            return pow(mx, 2);
        }
        if (x < mx) {
            return pow(mx, 2) - (mx - x - 1);
        } else if (x == mx && y == mx) {
            return pow(mx, 2) - (mx - 1);
        } else {
            return pow(mx, 2) - (mx - 1) - (mx - y);
        }
    } else {
        if (y == 1) {
            return pow(mx, 2);
        }
        if (y < mx) {
            return pow(mx, 2) - (mx - y);
        } else if (x == mx && y == mx) {
            return pow(mx, 2) - (mx - 1);
        } else {
            return pow(mx, 2) - (mx - 1) - (mx - x);
        }
    }
}*/

int main() {
    int t;
    cin >> t;
    // for (int i = 0; i < t; i++) {
    while (t--) {
        long long y, x;
        // cin >> y >> x;
        // long long ans = solve(x, y);
        // cout << ans << "\n";
        cin >> x >> y;
        if (x < y) {
            if (y % 2 == 1) {
                long long r = y * y;
                cout << r - x + 1 << "\n";
            } else {
                long long r = (y - 1) * (y - 1) + 1;
                cout << r + x - 1 << "\n";
            }
        } else {
            if (x % 2 == 0) {
                long long r = x * x;
                cout << r - y + 1 << "\n";
            } else {
                long long r = (x - 1) * (x - 1) + 1;
                cout << r + y - 1 << "\n";
            }
        }
    }
}
