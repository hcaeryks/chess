
#define U64 unsigned long long

#define empty_board "8/8/8/8/8/8/8/8 b - - "
#define start_position                                                         \
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1 "
#define tricky_position                                                        \
  "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1 "
#define killer_position                                                        \
  "rnbqkb1r/pp1p1pPp/8/2p1pP2/1P1P4/3P3P/P1P1P3/RNBQKBNR w KQkq e6 0 1"
#define cmk_position                                                           \
  "r2q1rk1/ppp2ppp/2n1bn2/2b1p3/3pP3/3P1NPP/PPP1NPB1/R1BQ1RK1 b - - 0 9 "

enum {
  a8,
  b8,
  c8,
  d8,
  e8,
  f8,
  g8,
  h8,
  a7,
  b7,
  c7,
  d7,
  e7,
  f7,
  g7,
  h7,
  a6,
  b6,
  c6,
  d6,
  e6,
  f6,
  g6,
  h6,
  a5,
  b5,
  c5,
  d5,
  e5,
  f5,
  g5,
  h5,
  a4,
  b4,
  c4,
  d4,
  e4,
  f4,
  g4,
  h4,
  a3,
  b3,
  c3,
  d3,
  e3,
  f3,
  g3,
  h3,
  a2,
  b2,
  c2,
  d2,
  e2,
  f2,
  g2,
  h2,
  a1,
  b1,
  c1,
  d1,
  e1,
  f1,
  g1,
  h1,
  no_sq
};

enum { P, N, B, R, Q, K, p, n, b, r, q, k };

enum { white, black, both };

enum { rook, bishop };

enum { wk = 1, wq = 2, bk = 4, bq = 8 };
typedef struct {

  int moves[256];

  int count;
} moves;

#define set_bit(bitboard, square) ((bitboard) |= (1ULL << (square)))
#define get_bit(bitboard, square) ((bitboard) & (1ULL << (square)))
#define pop_bit(bitboard, square) ((bitboard) &= ~(1ULL << (square)))
#define FENmidgame                                                             \
  "4k2r/pp1rbpp1/2n1b3/2P1p2p/6P1/P1P1B2P/1PKN1P2/3R1B1R w k h6 0 17"


#define copy_board()                                                           \
  U64 bitboards_copy[12], occupancies_copy[3];                                 \
  int side_copy, enpassant_copy, castle_copy;                                  \
  memcpy(bitboards_copy, bitboards, 96);                                       \
  memcpy(occupancies_copy, occupancies, 24);                                   \
  side_copy = side, enpassant_copy = enpassant, castle_copy = castle;

#define take_back()                                                            \
  memcpy(bitboards, bitboards_copy, 96);                                       \
  memcpy(occupancies, occupancies_copy, 24);                                   \
  side = side_copy, enpassant = enpassant_copy, castle = castle_copy;

enum { all_moves, only_captures };


unsigned int get_random_U32_number();
U64 get_random_U64_number() ;
U64 generate_magic_number() ;
static inline int count_bits(U64 bitboard);
static inline int get_ls1b_index(U64 bitboard);
void print_bitboard(U64 bitboard) ;
void print_board() ;
void parse_fen(char *fen);
U64 mask_pawn_attacks(int side, int square);
U64 mask_knight_attacks(int square) ;
U64 mask_king_attacks(int square) ;
U64 mask_bishop_attacks(int square) ;
U64 mask_rook_attacks(int square);
U64 bishop_attacks_on_the_fly(int square, U64 block);
U64 rook_attacks_on_the_fly(int square, U64 block);
void init_leapers_attacks() ;
U64 set_occupancy(int index, int bits_in_mask, U64 attack_mask) ;
U64 find_magic_number(int square, int relevant_bits, int bishop) ;
void init_magic_numbers() ;
void init_sliders_attacks(int bishop) ;
static inline U64 get_bishop_attacks(int square, U64 occupancy) ;
static inline U64 get_rook_attacks(int square, U64 occupancy) ;
static inline U64 get_queen_attacks(int square, U64 occupancy) ;
static inline int is_square_attacked(int square, int side) ;
void print_attacked_squares(int side) ;
static inline void add_move(moves *move_list, int move) ;
void print_move(int move) ;
void print_move_list(moves *move_list);
static inline int make_move(int move, int move_flag) ;
static inline void generate_moves(moves *move_list) ;
int get_time_ms() ;
static inline void perft_driver(int depth) ;
void perft_test(int depth) ;
static inline int evaluate();
static inline void enable_pv_scoring(moves *move_list) ;
static inline int score_move(int move) ;
static inline int sort_moves(moves *move_list);
void print_move_scores(moves *move_list) ;
static inline int quiescence(int alpha, int beta) ;
static inline int negamax(int alpha, int beta, int depth) ;
void search_position(int depth) ;
int parse_move(char *move_string);
void parse_position(char *command);
void parse_go(char *command) ;
void uci_loop() ;
void init_all() ;
int main(int argc, char **argv) ;

