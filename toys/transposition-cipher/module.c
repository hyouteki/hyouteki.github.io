#define HASH_LEN 20
#define MAX_KEY_LEN 9

char HASH[HASH_LEN] = {0};

// imported APIs
extern unsigned int cstrlen(char *input);
extern void print(char *input);
extern void printd(int num);

// exported APIs
char *hash(char *input);
int hash_len();

// djb2 hash
// REFERENCE: http://www.cse.yorku.ca/~oz/hash.html#djb2
static unsigned long djb2_hash(char *input) {
	unsigned long ret = 5381;
	while (*input != 0) {
		ret = ret*33 + *input;
		input++;
	}
	return ret;
}

char *hash(char *input) {
	unsigned long hash_val = djb2_hash(input);
	for (int i = HASH_LEN-1; i >= 0; --i) {
	    HASH[i] = hash_val%10 + 'a';
		hash_val /= 10;
	}
	return HASH;
}

int hash_len() {
	return HASH_LEN;
}
