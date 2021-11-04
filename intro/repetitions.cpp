#include <bits/stdc++.h>

using namespace std;

int main() {
    string dna;
    cin >> dna;
    char prev = ' ';
    int ccount, mxcount;
    ccount = mxcount = 0;
    for (char ch : dna) {
        if (ch == prev) {
            ccount += 1;
        } else {
            prev = ch;
            mxcount = max(mxcount, ccount + 1);
            ccount = 0;
        }
    }
    mxcount = max(mxcount, ccount + 1);
    cout << mxcount;
}
