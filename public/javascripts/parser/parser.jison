
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

"["[" "]*"]"                  return '[]'
"["                   return '['
"]"                   return ']'
"."                   return '.'

"var"                return 'var'
"global"             return 'global'
"const"              return 'const'


"import"             return 'import'
"integer"            return 'integer'
"double"             return 'double'
"char"               return 'char'
"boolean"            return 'boolean'
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
"define"             return 'define'
"as"                 return 'as'

"("                   return '('
")"                   return ')'


[0-9]+"."[0-9]+       return 'deci'
[0-9]+                return 'num'

"\""[^\"]*"\""                              return 'cadena'
[']([^\n]|[\\][0-9][0-9]?[0-9]?)[']         return 'caracter'

[a-zA-Z_][a-zA-Z0-9_]*    return 'id';


<<EOF>>               return 'EOF'
.                     return 'INVALID'

/lex

/* operator associations and precedence */

%left '=' ':='
%left '++' '--'
%left '==' '!='
%left '+' '-'

%left '*' '/' '%'

%right '!' UMINUS
%right 'strc'

%left '['  '.'  '('
%token PREFIX SUFFIX
%start init

%% /* language grammar */


init
    : listGlobalSentences  EOF
    ;

listGlobalSentences
    : globalSentences
    |
    ;

globalSentences
    : globalSentences globalSentence
    | globalSentence
    ;

globalSentence
    : declareVariable pComa
    | functionDefinition
    ;



declareVariable
    : pType decType idVariable '=' e
    | id  decType idVariable '=' e



    | pType decType idVariable
    | id  decType idVariable

    | 'var' id ':=' e

    | 'const' id ':=' e

    | 'global' id ':=' e

    ;


functionDefinition
    : pType decType id '(' listParameters ')' '{' listFunctionSentences '}'
    | id decType id '('  listParameters ')' '{' listFunctionSentences  '}'
    ;


listParameters
    : parameters
    |
    ;

parameters
    : parameters ',' parameter
    | parameter
    ;

parameter
    : id decType id
    | pType decType id
    ;

listFunctionSentences
    : functionSentences
    |
    ;

functionSentences
    : functionSentences functionSentence
    | functionSentence
    ;

functionSentence
    : assign pComa
    | declareVariable pComa
    | callFunction pComa
    | callFunctionPro pComa
    | aumento pComa
    | defineStruct pComa
    | ifSentence

    ;

assign
    : expLeft '=' e
    ;

expLeft
    : id
    | expLeft '[' e ']'
    | expLeft '.' id
    ;

callFunctionPro
    : expLeft '.' id '(' listArguments ')'
    ;

idVariable
    : idVariable ','  id
    |  id
    ;

decType
    : '[]'
    |
    ;

type
    : id
    | pType
    ;


pType
    : 'integer'
    | 'double'
    | 'char'
    | 'boolean'
    | 'void'
    ;

e
    : e '+' e
    | '(' e ')'
    | id
    | callFunction
    | e '.'  id  '(' listArguments ')'
    | e '[' e ']'
    | num
    | deci
    | aumento
    | arrayInstance
    | structInstance
    | e '.' id



    ;

callFunction
    : id '(' listArguments ')'
    ;



listArguments
    :
    | arguments
    ;

arguments
    : arguments ',' argument
    | argument

    ;

argument
    : e
    | e '=' e
    ;

structInstance
    : 'strc' id '(' ')'
    ;

arrayInstance
    : 'strc' pType '[' exp ']'
    | 'strc' id '[' exp ']'
    | '{' listExp '}'

    ;

defineStruct
    : 'define' id 'as' '[' structAttributes ']'
    | 'define' id 'as' '[' ']'
    ;

structAttributes
    : structAttributes structAttribute
    | structAttribute
    ;

structAttribute
    : pType decType
    | id decType
    | pType decType '=' e
    | id decType '=' e
    ;

listExp
    : exps
    |
    ;

exps
    : exps ',' e
    | e
    ;

aumento
    : id '++'
    | id '--'
    ;


ifSentence
    : 'if' '(' e ')' ifBlock
    | 'if' '(' e ')' ifBlock 'else' ifBlock
    | 'if' '(' e ')' ifSentence
    ;

ifBlock
    : '{' listFunctionSentences '}'
    ;

pComa
    : ';'
    |
    ;