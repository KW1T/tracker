#include <bits/stdc++.h>

using namespace std;

int main() {
    int n;
    cin >> n;
    long xi;
    long prev = 0;
    long long moves = 0;
    for (int i = 0; i < n; i++) {
        cin >> xi;
        if (xi >= prev) {
            prev = xi;
            continue;
        }
        moves += prev - xi;
    }
    cout << moves;
}
