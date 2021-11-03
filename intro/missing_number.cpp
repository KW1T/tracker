#include <bits/stdc++.h>

using namespace std;

int main() {
    long n;
    cin >> n;
    if (n < 2 || n > 2 * pow(10, 5)) {
        cout << "ERROR: out of bounds";
        return 1;
    }
    long long sum = 0;
    long in;
    for (int i = 0; i < n - 1; i++) {
        cin >> in;
        sum += in;
    }
    long long exp_total = n * (n + 1) / 2;
    cout << exp_total - sum;
    return 0;
}
