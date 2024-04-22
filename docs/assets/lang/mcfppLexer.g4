lexer grammar mcfppLexer;

WAVE:'~';
RESERVED: '...' ;
DOT: '.' ;
COMMA: ',' ;
LPAREN: '(';
RPAREN: ')';
LSQUARE: '[';
RSQUARE: ']';
LCURL: '{' -> pushMode(DEFAULT_MODE);
RCURL: '}' -> popMode;
MULT: '*' ;
MOD: '%' ;
DIV: '/' ;
ADD: '+' ;
SUB: '-' ;
INCR: '++' ;
DECR: '--' ;
CONJ: '&&' ;
DISJ: '||' ;
EXCL: '!';
COLON: ':' ;
SEMICOLON: ';' ;
ASSIGNMENT: '=' ;
ADD_ASSIGNMENT: '+=' ;
SUB_ASSIGNMENT: '-=' ;
MULT_ASSIGNMENT: '*=' ;
DIV_ASSIGNMENT: '/=' ;
MOD_ASSIGNMENT: '%=' ;
ARROW: '->' ;
DOUBLE_ARROW: '=>' ;
RANGE: '..' ;
COLONCOLON: '::' ;
DOUBLE_SEMICOLON: ';;' ;
HASH: '#' ;
AT: '@' ;
QUEST: '?' ;
LANGLE: '<' ;
RANGLE: '>' ;
LE: '<=' ;
GE: '>=' ;
EXCL_EQ: '!=' ;
EXCL_EQEQ: '!==' ;
EQEQ: '==' ;
EQEQEQ: '===' ;
SINGLE_QUOTE: '\'' ;
RIGHT_SHIFT_ARITHMETIC:           '>>';
LEFT_SHIFT_ARITHMETIC:            '<<';
RIGHT_SHIFT_LOGICAL:              '>>>';
BIT_AND:                         '&';
BIT_X_OR:                         '^';
BIT_OR:                          '|';
LEFT_SHIFT_ARITHMETIC_ASSIGN:      '<<=';
RIGHT_SHIFT_ARITHMETIC_ASSIGN:     '>>=';
RIGHT_SHIFT_LOGICAL_ASSIGN:        '>>>=';
BIT_AND_ASSIGN:                   '&=';
BIT_XOR_ASSIGN:                   '^=';
BIT_OR_ASSIGN:                    '|=';
TRIPLE_QUOTE_OPEN: '"""' -> pushMode(MultiLineString) ;

KEYWORD :
    THIS | SUPER | IF | ELSE | WHILE | FOR | DO | TRY | STORE
    | BREAK | CONTINUE | RETURN
    | STATIC | EXTENDS | NATIVE | CONCRETE | FINAL
    | PUBLIC | PROTECTED | PRIVATE
    | OVERRIDE | ABSTRACT
    | CONST | DYNAMIC | IMPORT | INLINE
    | CLASS | INTERFACE | TEMPLATE | FUNCTION
    | GLOBAL | VAR ;

THIS:'this';
SUPER:'super';
IF:'if';
ELSE:'else';
WHILE:'while';
FOR:'for';
DO:'do';
TRY:'try';
STORE:'store';

BREAK:'break';
CONTINUE:'continue';
RETURN:'return';

STATIC:'static';
EXTENDS:'extends';
NATIVE:'native';
CONCRETE:'concrete';
FINAL:'final ';

PUBLIC:'public';
PROTECTED:'protected';
PRIVATE:'private';

OVERRIDE: 'override';
ABSTRACT: 'abstract';

CONST:'const';
DYNAMIC:'dynamic';
IMPORT: 'import';
INLINE:'inline';

CLASS:'class';
INTERFACE:'interface';
TEMPLATE:'template';
FUNCTION:'func';

GLOBAL:'global';
VAR:'var';

NAMESPACE: 'namespace';
VEC:'vec';
INT    :   'int';
ENTITY:       'entity';
BOOL:   'bool';
FLOAT:   'float';
SELECTOR:   'selector';
STRING:   'string';
JTEXT:   'jtext';
NBT:  'nbt';
ANY:   'any';
VOID: 'void';

TargetSelector
    :   '@' ('a'|'r'|'p'|'s'|'e')
    ;

IntegerLiteral:[1-9][0-9]*|[0];

FloatLiteral
    :   IntegerLiteral '.' [0-9]+
    |   [0-9] ('.' [0-9]+)? 'e' '-'? [0-9]
    ;

BooleanLiteral
    :   'true'
    |   'false'
    ;




Identifier
    :   [a-z_][a-zA-Z0-9_]*
    ;

ClassIdentifier
    :   [A-Z][a-zA-Z0-9_]*
    ;

NormalString
    :   [A-Za-z0-9_]+
    ;

NBT_BYTE_ARRAY_BEGIN: '[B;';
NBT_INT_ARRAY_BEGIN: '[I;';
NBT_LONG_ARRAY_BEGIN: '[L;';

NBTByteLiteral: ([1-9][0-9]*|[0])[b|B];
NBTShortLiteral: ([1-9][0-9]*|[0])[s|S];
NBTIntLiteral: IntegerLiteral;
NBTLongLiteral: ([1-9][0-9]*|[0])[l|L];
NBTFloatLiteral: IntegerLiteral '.' [0-9]+[f|F];
NBTDoubleLiteral: IntegerLiteral '.' [0-9]+[f|D]?;




LineString: ('"' .*? '"' )|( '\'' .*? '\'' );

OrgCommand
    :   '/' [a-z]* ([ ][a-z:._{}\\[0-9A-Z\]]*)+
    ;

WS  :  [ \t\r\n\u000C]+
    ;

DOC_COMMENT
    :   '/**' .*? '*/' -> channel(HIDDEN)
    ;

BLOCK_COMMENT
    :   '/*' .*? '*/' -> channel(HIDDEN)
    ;

LINE_COMMENT
    :   '//' ~[\r\n]* -> channel(HIDDEN)
    ;




mode MultiLineString ;

TRIPLE_QUOTE_CLOSE
    : MultiLineStringQuote? '"""' -> popMode
    ;

MultiLineStringQuote
    : '"'+
    ;


MultiLineStrExprStart
    : '${' -> pushMode(DEFAULT_MODE)
    ;


MultiLineStrText
    :  ~('"' | '$')+ | '$'
    ;