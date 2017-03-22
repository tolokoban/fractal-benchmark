// Compile this C code with https://mbebenita.github.io/WasmExplorer/

#include <emscripten/emscripten.h>

// Initialise seed for Mitchell and Moore algorithm.
unsigned int values[64] = {
  197836, 142543, 291521, 273561, 670056, 116695, 683937, 296537,
  177078, 951911, 593837, 986708, 452842, 106204, 131928, 664729,
  264312, 809367, 493748, 202314, 437622, 128469, 596988, 260804,
  163751, 367768, 128855, 972013, 767828, 473042, 455736, 179862,
  838753, 985825, 893627, 804729, 233619, 199135, 624805, 365403,
  980247, 443497, 453940, 118814, 603288, 600320, 736065, 909999,
  583336, 670013, 387305, 806653, 952255, 828683, 938444, 138474,
  313893, 283357, 221719, 212776, 774775, 779879, 794590, 787382
};

void EMSCRIPTEN_KEEPALIVE compute(
    unsigned char* data, int dots,
    unsigned int W, unsigned int H, int CX, int CY, int Z,
    float pa, float vxa, float vya, float m11a, float m12a, float m21a, float m22a,
    float pb, float vxb, float vyb, float m11b, float m12b, float m21b, float m22b,
    float pc, float vxc, float vyc, float m11c, float m12c, float m21c, float m22c,
    float pd, float vxd, float vyd, float m11d, float m12d, float m21d, float m22d
) {

  unsigned int size = (W * H) << 2;
  unsigned char v;
  unsigned int rnd, p, idx;
  unsigned int x, y, xx, yy, xd, yd;
  unsigned int n = 54;
  unsigned int a = 64 - 24;
  unsigned int b = 64 - 55;

  while( dots --> 0) {
    n = (n + 1) & 63;
    rnd = (values[(a + n) & 63] + values[(b + n) & 63]) & 0xFFFF;
    values[n] = rnd;
    p = rnd & 1023;
    if( p < pa ) {
      xx = x * m11a + y * m12a + vxa;
      yy = x * m21a + y * m22a + vya;
    }
    else if( p < pb ) {
      xx = x * m11b + y * m12b + vxb;
      yy = x * m21b + y * m22b + vyb;
    }
    else if( p < pc ) {
      xx = x * m11c + y * m12c + vxc;
      yy = x * m21c + y * m22c + vyc;
    }
    else {
      xx = x * m11d + y * m12d + vxd;
      yy = x * m21d + y * m22d + vyd;
    }
    xd = xx*Z + CX;
    yd = yy*Z + CY;
    idx = 1 + ((xd + W * yd) << 2);
    if( idx > 0 && idx <= size ) {
      v = data[idx];
      if( v < 255 ) {
        data[idx] = v + 1;
      }
    }
    x = xx;
    y = yy;
  }
}
