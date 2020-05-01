
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
":"                   return ':'

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
"try"                return 'try'
"catch"              return 'catch'


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
%start init

%% /* language grammar */


init
    : listGlobalSentences  EOF { return $1; }
    ;

listGlobalSentences
    : globalSentences   {  $$ = $1;  }
    |                   { $$ = []; }
    ;

globalSentences
    : globalSentences globalSentence {  $$ = $1; $1.push($2); }
    | globalSentence  { $$ = [$1]; }
    ;

globalSentence
    : declareVariable pComa {  $$= $1; }
    | assign pComa { $$ = $1; console.log($1 + "------------"); }
    //| functionDefinition
    //| defineStruct
    ;



declareVariable
    :
    pType decType idVariable '=' e
    //| id  decType idVariable '=' e



    | pType decType idVariable { $$= new ast.NodoDeclararVarTipo5(ast.fl(yy, @1), $1, $2, $3); }
    //| id  decType idVariable

    //| 'var' id ':=' e

    //| 'const' id ':=' e

    //| 'global' id ':=' e

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
    | switchSentence
    | whileSentence
    | doWhileSentence pComa
    | forSentence
    | 'break' pComa
    | 'continue' pComa
    | sentReturn

    ;

sentReturn
    : 'return' e pComa
    | 'return' ';'
    ;

assign
    : expLeft '=' e { $$= new ast.NodoAsignar(ast.fl(yy, @1), $1, $3); }
    ;

expLeft
    : id { $$ = new ast.NodoObtenerVar(ast.fl(yy, @1), $1 ); }
    //| expLeft '[' e ']'
    //| expLeft '.' id
    ;

callFunctionPro
    : expLeft '.' id '(' listArguments ')'
    ;

idVariable
    : idVariable ','  idVarsDeclaration {  $$ = $1; $1.push($3); }
    |  idVarsDeclaration { $$=[$1]; }
    ;

idVarsDeclaration
    : id {
            $$ = new ast.NodoDeclararVar(ast.fl(yy, @1), $1  ) ;
         }
    ;


decType
    : '[]' {$$=true;}
    | {$$=false; }
    ;

type
    : id
    | pType
    ;


pType
    : 'integer' { $$ = new ast.NodoObtenerTipoInt(ast.fl(yy,  @1)) ; }
    | 'double'  { $$ = new ast.NodoObtenerTipoDouble(ast.fl(yy,  @1)) ; }
    | 'char'    { $$ = new ast.NodoObtenerTipoChar(ast.fl(yy,  @1)) ; }
    | 'boolean' { $$ = new ast.NodoObtenerTipoBoolean(ast.fl(yy,  @1)) ; }
    | 'void'
    ;

e
    : e '+' e { $$= new ast.NodoSuma(ast.fl(yy,  @1), $1, $3);}
    | '(' e ')' { $$ = $1; }
    | id
    | callFunction
    | explicitCast
    | e '.'  id  '(' listArguments ')'
    | e '[' e ']'
    | num  { $$ = new ast.NodoCrearInt(ast.fl(yy,  @1), $1 );}
    | deci
    | aumento
    | arrayInstance
    | structInstance
    | e '.' id

    ;

explicitCast
    : '(' 'char' ')' e
    | '(' 'integer' ')' e
    | '(' 'double' ')' e
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
    : 'if' '(' e ')' blockSentence
    | 'if' '(' e ')' blockSentence 'else' blockSentence
    | 'if' '(' e ')' ifSentence
    ;

whileSentence
    : 'while' '(' e ')' blockSentence
    ;

doWhileSentence
    :'do' blockSentence 'while' '(' e ')'
    ;

forSentence
    : 'for' '(' forInit ';' forCondition ';' forFinal ')' blockSentence
    ;

 forInit
    : declareVariable
    | assign
    |
    ;

forCondition
    : e
    |
    ;

forFinal
    :assign
    |aumento
    |
    ;

switchSentence
    : 'switch' '(' e ')' '{' '}'
    | 'switch' '(' e ')' '{' casesSent '}'
    | 'switch' '(' e ')' '{' casesSent defaultSent '}'
    | 'switch' '(' e ')' '{' defaultSent '}'
    ;


defaultSent
    : 'default' ':' listFunctionSentences
    ;

casesSent
    : casesSent caseSent
    | caseSent
    ;

caseSent
    : 'case' e ':' listFunctionSentences
    ;

blockSentence
    : '{' listFunctionSentences '}'
    ;



throwSentence
    : 'throw' e
    ;

trySentence
    : 'try' blockSentence catch '(' declareVariable ')' blockSentence
    ;



pComa
    : ';'
    |
    ;