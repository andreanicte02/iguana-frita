
/* description: Parses and executes mathematical expressions. */

/* lexical grammar */
%lex
%%

\s+                   /* skip whitespace */

"*"                   return '*'
"/"                   return '/'
"-"                   return '-'
"+"                   return '+'
"^^"                  return '^^'
"!"                   return '!'
"%"                   return '%'
"("                   return '('
")"                   return ')'
","                   return ','
";"                   return ';'
":="                  return ':='
"=="                  return '=='
"==="                 return '===' //referencias
"="                   return '='
"!="                  return '!='
"<="                  return '<='
"<"                   return '<'
">="                  return '>='
">"                   return '>'
"&&"                  return '&&'
"||"                  return '||'
"^"                   return '^'
"++"                  return '++'
"--"                  return '--'
"{"                   return '{'
"}"                   return '}'
"["                   return '['
"]"                   return ']'

"import"             return 'import'
"integer"            return 'integer'
"double"             return 'double'
"char"               return 'char'
"boolean"            return 'boolean'
"var"                return 'var'
"global"             return 'global'
"const"              return 'const'
"true"               return 'true'
"false"              return 'false'
"if"                 return 'if'
"else"               return 'else'
"switch"             return 'switch'
"case"               return 'case'
"default"            return 'default'
"print"              return 'print'
"while"              return 'while'
"do"                 return 'do'
"for"                return 'for'
"break"              return 'break'
"continue"           return 'continue'
"return"             return 'return'
"void"               return 'void'
"strc"               return 'strc'


[0-9]+"."[0-9]+       return 'deci'
[0-9]+                return 'num'
[A-Za-z|_]+([A-Za-z|0-9|_]+)?               return 'id'
"\""[^\"]*"\""                              return 'cadena'
[']([^\n]|[\\][0-9][0-9]?[0-9]?)[']         return 'caracter'

<<EOF>>               return 'EOF'
.                     return 'INVALID'

/lex

/* operator associations and precedence */
%left '=' ':='
%left '==' '!='
%left '+' '-'
%left '*' '/' '%'
%left '^^'
%right '!' UMINUS
%left '[' ']' '.'

%start init

%% /* language grammar */


init
    : lPSentences  EOF
    ;

lPSentences
    : sentences
    | %empty
    ;

sentences
    : sentences sentence
    | sentence
    ;

sentence
    : sentImport
    | dVars  ';'
    | assign ';'
    | decFunction
    | callFunction ';'
    ;


dVars
    : type idList
    | type idList '=' e
    | global  id ':=' e
    | var     id ':=' e
    | const   id ':=' e
    ;

assign
    : id '=' e
    ;

idList
    : idList ',' id
    | id
    ;

type
    : id arrayDec
    | tipe arrayDec
    ;

arrType
    : tipe
    | id
    ;

arrayDec
    : '[' ']'
    | %empty
    ;


tipe
    : integer
    | double
    | char
    | boolean
    | void
    ;


sentImport
    : sentImport ',' id
    | import id
    ;

decFunction
    : type id '(' decParameter ')' '{' lPSentences'}'
    ;


decParameter
    : parameters
    | %empty
    ;

parameters
    : parameters parameter
    | parameter
    ;

parameter
    : type id
    ;

e
    : e '+' e

    | e '-' e

    | e '*' e

    | e '/' e

    | e '^^' e

    | e '==' e

    | e '%'

    | '-' e %prec UMINUS

    | '(' e ')'

    | num

    | deci

    | id

    | cadena

    | caracter

    | true

    | false

    | arrayInit

    | arrayAccess

    | callFunction

    ;

callFunction
    : id '(' arguments ')'
    ;

arguments
    :exps
    |argumentsType2
    | %empty
    ;

exps
    : exps ',' e
    | e
    ;

argumentsType2
    : argumentsType1 ',' assign
    | assign
    ;

arrayInit
    : strc arrType '[' exp ']'
    | '{' exps '}'
    | '{' '}'
    ;

arrayAccess
    : e '[' e ']'
    ;
