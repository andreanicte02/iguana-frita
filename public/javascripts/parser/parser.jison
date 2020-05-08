
/* lexical grammar */
%lex


%s                comment



EscapeSequence                  ('\\' [btnfr"'\\])
SingleCharacter                 [^'\\]
StringCharacter                 [^"\\] | {EscapeSequence}
StringCharacters                {StringCharacter}+

JavaCharacterLiteral            ('\''{SingleCharacter}'\'')|('\''{EscapeSequence}'\'')
JavaStringLiteral               '"' {StringCharacters}? '"'



%%
"/*"                  {

                        this.begin('comment');
                        }
<comment>"*/"         {

                        this.popState();
                        }
<comment>.            /* skip comment content*/


"abstract"              return 'abstract'

"break"                 return 'break'
"boolean"               return 'boolean'

"case"                  return 'case'
"class"                 return 'class'
"char"                  return 'char'
"continue"              return 'continue'

"default"               return 'default'
"double"                return 'double'
"do"                    return 'do'

"else"                  return 'else'
"extends"               return 'extends'
"false"                 return 'false'
"final"                 return 'final'
"for"                   return 'for'

"if"                    return 'if'
"import"                return 'import'
"integer"               return 'integer'

"new"                   return 'new'
"null"                  return 'NULL'

"println"               return 'println'
"print"                 return 'print'
"public"                return 'public'
"private"               return 'private'
"protected"             return 'protected'

"return"                return 'return'

"switch"                return 'switch'
"str"                   return 'str'
"static"                return 'static'
"super"                 return 'super'

"this"                  return 'this'
"throw"                 return 'throw'
"true"                  return 'true'
"toDouble"              return 'toDouble'
"toInt"                 return 'toInt'
"toChar"                return 'toChar'

"void"                  return 'void'
"while"                 return 'while'


"//".*                /* skip comments */

\s+                   /* skip whitespace */


"{"                     return '{'
"}"                     return '}'
"["                     return '['
"]"                     return ']'
";"                     return ';'
":"                     return ':'
"?"                     return '?'
","                     return ','

[0-9]+"."[0-9]+         return 'DOUBLE'
[0-9]+                  return 'INTEGER'
{JavaCharacterLiteral}  return 'CHAR';
{JavaStringLiteral}     return 'STRING';


"."                     return '.'


"||"                    return '||'
"&&"                    return '&&'
"^"                     return '^'
"!="                    return '!='
"!"                     return '!'

"%"                   return '%'
"*"                   return '*'
"/"                   return '/'
"--"                  return '--'
"-"                   return '-'
"++"                  return '++'
"+"                   return '+'
"^"                   return '^'
"!"                   return '!'
"%"                   return '%'
"("                   return '('
")"                   return ')'

"=="                    return '=='
"="                     return '='

"<="                    return '<='
">="                    return '>='
"<"                     return '<'
">"                     return '>'
"@"                     return '@'
"#"                     return '#'




[a-zA-Z_][a-zA-Z0-9_]*    return 'IDENTIFIER';

<<EOF>>               return 'EOF'
.                     return 'INVALID'

/lex




/* operator associations and precedence */

%right '?'
%left '||'
%left '&&'
%left '^'
%left '==' '!='
%left '<' '>' '<=' '>='
%left '+' '-'
%left '*' '/' '%'

%right UMINUS
%right 'new' UCHAR UINT UDOUBLE

%left '--' '++' '!'
%left '.' '['

%left HOPE2
%left HOPE

%start withBeingDrunk

%% /* language grammar */

withBeingDrunk
    : globalSentenceList EOF               { return $1; }
    ;

globalSentenceList
    : globalSentences                   { $$ = $1; }
    | %empty                            { $$ = []; }
    ;
globalSentences
    : globalSentences globalSentence    { $$ = $1.concat($2); }
    | globalSentence                    { $$ = [$1];          }
    ;
globalSentence
    : importSentence ";"                { $$ = $1; }
    | classLevelVarDeclaration ';'      { $$ = $1; }
    | classLevelFunDeclaration          { $$ = $1; }
    ;


funSentenceList
    :                               { $$ = []; }
    | funSentences                  { $$ = $1; }
    ;
funSentences
    : funSentences funSentence      { $$ = $1.concat($2); }
    | funSentence                   { $$ = [$1];          }
    ;
funSentence
    : assignation ';'               { $$ = $1; }
    | funLevelVarDeclaration ';'    { $$ = $1; }
    | increment ';'                 { $$ = $1; }
    | normalInvoke ';'              { $$ = $1; }
    | dotInvoke ';'                 { $$ = $1; }
    | simplePrint ';'               { $$ = $1; }
    | whileLoop                     { $$ = $1; }
    | forLoop                       { $$ = $1; }
    | doWhileLoop                   { $$ = $1; }
    | ifControl                     { $$ = $1; }
    | switchControl                 { $$ = $1; }
    | returnControl ';'             { $$ = $1; }
    | breakControl  ';'             { $$ = $1; }
    | continueControl ';'           { $$ = $1; }
    | throwControl ';'              { $$ = $1; }
    ;

/* ********************************************************** */
/* ********************** Sentences ************************* */

importSentence
    : 'import' STRING                           {  }
    ;

classLevelModifiers
    : classLevelModifiers classLevelModifier    {  }
    | classLevelModifier                        {  }
    ;
classLevelModifier
    : 'public'                                  {  }
    | 'private'                                 {  }
    | 'protected'                               {  }
    | localLevelModifier                        {  }
    ;
localLevelModifier
    : 'abstract'                                {  }
    | 'final'                                   {  }
    | 'static'                                  {  }
    ;
funLevelModifier
    : 'abstract'                                {  }
    | 'final'                                   {  }
    ;


classLevelVarDeclaration
    : type varDeclarations                                      { $$ = new ast.NodoDeclararVarTipo5(ast.fl(yy, @1), $1, false, $2);  }
    | type arrayInstanceType varDeclarations                    {   }
    | type varDeclarations '=' expression                       {   }
    | type arrayInstanceType varDeclarations '=' expression     {   }
    ;
funLevelVarDeclaration
    : primitiveType varDeclarations         {  }
    | IDENTIFIER varDeclarations            {  }
    ;

varDeclarations
    : varDeclarations ',' varDeclaration    { $$ = $1.concat($3); }
    | varDeclaration                        { $$ = [$1];          }
    ;
varDeclaration
    : IDENTIFIER                            { $$ = new ast.NodoDeclararVar(ast.fl(yy, @1), $1  ) ;  }
    ;

arrayLiteral
    : '{' arrayElementList '}'                      {  }
    ;

arrayElementList
    :                                               { $$ = []; }
    | arrayElements                                 { $$ = $1; }
    ;
arrayElements
    : arrayElements ',' arrayElement                { $$ = $1; $1.push($3); }
    | arrayElement                                  { $$ = [$1]; }
    ;

arrayElement
    : expression                                    { $$ = $1; } // aqui se podria desenvolver
    | arrayLiteral                                  { $$ = $1; }
    ;

instanceType
    :                                               { $$ = new ast.EmptyInstanceTypeOperation($1); }
    | arrayInstanceType                             { $$ = $1; }
    ;
arrayInstanceType
    : arrayInstanceType '[' ']'                     { $$ = new ast.ArrayInstanceTypeOperation($1); }
    | '[' ']'                                       { $$ = new ast.ArrayInstanceTypeOperation(undefined); }
    ;

classLevelFunDeclaration
    : type  IDENTIFIER '(' paramDeclarationList ')'
      '{' funSentenceList '}'                       { $$ = new ast.NodoDeclararFuncion( ast.fl(yy, @2), $1, $2, $4, $7 ); }
    | type arrayInstanceType IDENTIFIER '(' paramDeclarationList ')'
      '{' funSentenceList '}'                       {  }
    ;


paramDeclarationList
    : paramDeclarations                         { $$ = $1; }
    |                                           { $$ = []; }
    ;
paramDeclarations
    : paramDeclarations ',' paramDeclaration    { $$ = $1.concat($3); }
    | paramDeclaration                          { $$ = [$1]; }
    ;
paramDeclaration
    : type '[' ']' IDENTIFIER       {  }
    | type IDENTIFIER               { $$ = new ast.NodoDeclararParametro( ast.fl(yy, @2), $1, $2 ); }
    ;


type
    : primitiveType { $$ = $1; }
    | IDENTIFIER    { $$ = new ast.NodoObtenerTipo(ast.fl(yy,  @1), $1);    }
    ;
primitiveType
    : 'integer'     { $$ = new ast.NodoObtenerTipoInteger(ast.fl(yy,  @1)); }
    | 'double'      { $$ = new ast.NodoObtenerTipoDouble(ast.fl(yy,  @1));  }
    | 'char'        { $$ = new ast.NodoObtenerTipoChar(ast.fl(yy,  @1)) ;   }
    | 'boolean'     { $$ = new ast.NodoObtenerTipoBool(ast.fl(yy,  @1)); }
    | 'void'        { $$ = new ast.NodoObtenerTipoVoid(ast.fl(yy,  @1));    }
    ;


assignation
    : expression '=' expression             { $$= new ast.NodoAsignar(ast.fl(yy, @1), $1, $3); }
    ;

expression
    : expression '-' expression             { $$ = new ast.NodoResta(ast.fl(yy, @1), $1, $3); }
    | expression '+' expression             { $$ = new ast.NodoSuma(ast.fl(yy, @1), $1, $3); }
    | expression '*' expression             { $$ = new ast.NodoMulti(ast.fl(yy, @1), $1, $3); }
    | expression '/' expression             {  }
    | expression '%' expression             { $$ = new ast.NodoModular(ast.fl(yy, @1), $1, $3); }
    | expression '!=' expression            {  }
    | expression '==' expression            {  }
    | expression '<' expression             { $$ = new ast.NodoRelacional(ast.fl(yy, @1), $1, $2, $3); }
    | expression '>' expression             { $$ = new ast.NodoRelacional(ast.fl(yy, @1), $1, $2, $3); }
    | expression '<=' expression            { $$ = new ast.NodoRelacional(ast.fl(yy, @1), $1, $2, $3); }
    | expression '>=' expression            { $$ = new ast.NodoRelacional(ast.fl(yy, @1), $1, $2, $3); }
    | expression '||' expression            { $$ = new ast.NodoOr(ast.fl(yy, @1), $1, $3); }
    | expression '&&' expression            { $$ = new ast.NodoAnd(ast.fl(yy, @1), $1, $3); }
    | expression '^' expression             { $$ = new ast.NodoXor(ast.fl(yy, @1), $1, $3); }
    | expression '.' IDENTIFIER             {  }
    | dotInvoke                             { $$ = $1; }
    | normalInvoke                          { $$ = $1; }
    | STRING                                { $$ = new ast.CreateStringNode(yy.last(), @1, JSON.parse($1) ); }
    | CHAR                                  {  }
    | DOUBLE                                {  }
    | INTEGER                               { $$ = new ast.NodoCrearInteger(ast.fl(yy, @1), $1 ); }
    | NULL                                  {  }
    | 'true'                                { $$ = new ast.NodoCrearTrue (ast.fl(yy, @1)); }
    | 'false'                               { $$ = new ast.NodoCrearFalse(ast.fl(yy, @1)); }
    | IDENTIFIER                            { $$ = new ast.NodoObtenerVar(ast.fl(yy, @1), $1 ); }
    | expression '[' expression ']'             {  }
    | '(' expression ')'                        { $$ = $2; }
    | '-' expression %prec UMINUS               { $$ = new ast.NodoUnarioMenos(ast.fl(yy, @1), $2); }
    | '!' expression                            { $$ = new ast.NodoNot(ast.fl(yy, @1), $2); }
    | expression "?" expression ":" expression  {  }
    | increment                                 { $$ = $1; }
    | 'new' type '(' expressionList ')'         {  }
    | 'new' type fixedArrayInit                 {  }
    | casting                                   { $$ = $1; }
    ;

casting
    : '(' 'int' ')' expression %prec UINT              { $$ = new ast.IntCastNode(yy.last(), @2, $4); }
    | '(' 'double' ')' expression %prec UDOUBLE           { $$ = new ast.DoubleCastNode(yy.last(), @2, $4); }
    | '(' 'char'  ')' expression %prec UCHAR            { $$ = new ast.CharCastNode(yy.last(), @2, $4); }
    ;

fixedArrayInit
    : fixedArrayInit '[' expression ']'  %prec HOPE     {   const last = new ast.HopeFixedArrayInitNode( yy.last(), @2, $3);
                                                            $1[1].setHopeFixedArrayInitNode(last);
                                                            $$ = [$1[0], last];
                                                        }
    | '[' expression ']'                    { let first = new ast.HopeFixedArrayInitNode(yy.last(), @1, $2); $$ = [first, first]; }
    ;


// separar las sentencias
normalInvoke
    : IDENTIFIER '(' expressionList ')'     { $$ = new ast.InnerFunInvoke(yy.last(), @1, $1, $3); }
    | 'print' '(' expressionList ')'        { $$ = new ast.InnerFunInvoke(yy.last(), @1, $1, $3); }
    | 'println' '(' expressionList ')'      { $$ = new ast.InnerFunInvoke(yy.last(), @1, $1, $3); }
    | 'super' '(' expressionList ')'        { $$ = new ast.SuperFunInvoke(yy.last(), @1, $3); }
    | 'this' '(' expressionList ')'         { $$ = new ast.ThisFunInvoke(yy.last(), @1, $3); }
    | 'str' '(' expressionList ')'        { $$ = new ast.InnerFunInvoke(yy.last(), @1, $1, $3); }
    | 'toDouble' '(' expressionList ')'        { $$ = new ast.InnerFunInvoke(yy.last(), @1, $1, $3); }
    | 'toInt' '(' expressionList ')'        { $$ = new ast.InnerFunInvoke(yy.last(), @1, $1, $3); }
    | 'toChar' '(' expressionList ')'        { $$ = new ast.InnerFunInvoke(yy.last(), @1, $1, $3); }
    ;


dotInvoke
    : expression '.' IDENTIFIER '(' expressionList ')'  { $$ = new ast.DotInvokeNode(yy.last(), @2, $1, $3, $5); }
    ;

increment
    : '++' expression                       { $$ = new ast.PreIncrementNode(yy.last(), @1, $2); }
    | '--' expression                       { $$ = new ast.PreDecrementNode(yy.last(), @1, $2); }
    | expression '++'                       { $$ = new ast.PostIncrementNode(yy.last(), @2, $1); }
    | expression '--'                       { $$ = new ast.PostDecrementNode(yy.last(), @2, $1); }
    ;


expressionList
    : expressions                   { $$ = $1; }
    |                               { $$ = []; }
    ;
expressions
    : expressions ',' expression    { $$ = $1;  $$.push($3); }
    | expression                    { $$ = [$1]; }
    ;

//-----------------------------
// Control sentences

whileLoop
    : 'while' '(' expression ')' '{'
        funSentenceList
      '}'                           { $$ = new ast.WhileNode( yy.last(), @1, $3, $6); }
    ;

doWhileLoop
    : 'do' '{'
        funSentenceList
      '}' 'while' '(' expression ')'  { $$ = new ast.DoWhileNode(yy.last(), @5, $3, $7); }
    ;

forLoop
    : 'for' '(' forInit  ';' expression ';'  increment  ')' '{'
        funSentenceList
      '}'                           { $$ = new ast.ForNode(yy.last(), @1, $3, $5, $7, $10); }
    | 'for' '(' forInit  ';' expression ';'  assignation  ')' '{'
        funSentenceList
      '}'                           { $$ = new ast.ForNode(yy.last(), @1, $3, $5, $7, $10); }
    ;

forInit
    : assignation             { $$ = $1; }
    | funLevelVarDeclaration  { $$ = $1; }
    ;



switchControl
    : 'switch' '(' expression  ')'   '{'
        cases
        'default' ':' funSentenceList
    '}'                                     { $$ = new ast.SwitchNode(yy.last(), @1, $3, $6, $9);  }
    | 'switch' '(' expression  ')'   '{'
              cases
       '}'                                     { $$ = new ast.SwitchNode(yy.last(), @1, $3, $6, []);  }
    | 'switch' '(' expression  ')'   '{'

           '}'                                     { $$ = new ast.SwitchNode(yy.last(), @1, $3, [], []);  }
    ;

cases
    : cases caseBlock           { $$ = $1; $1.push($2); }
    | caseBlock                 { $$ = [$1]; }
    ;

caseBlock
    : 'case' expression ':' funSentenceList         { $$ = new ast.CaseNode(yy.last(), @1, $2, $4); }
    ;


ifControl
    : 'if' '(' expression ')' ifBody                    { $$ = new ast.NodoIf(ast.fl(yy, @1), $3, $5, []); }
    | 'if' '(' expression ')' ifBody 'else' ifBody      { $$ = new ast.NodoIf(ast.fl(yy, @1), $3, $5, $7); }
    | 'if' '(' expression ')' ifBody 'else' ifControl   { $$ = new ast.NodoIf(ast.fl(yy, @1), $3, $5, [$7]); }
    ;

ifBody
    : '{' funSentenceList '}'       { $$ = $2; }
    ;


returnControl
    : 'return' expression   { $$ = new ast.ReturnNode(yy.last(), @1, $2); }
    | 'return'              { $$ = new ast.ReturnNode(yy.last(), @1, undefined); }
    ;

breakControl
    : 'break'               { $$ = new ast.BreakNode(yy.last(), @1); }
    ;

continueControl
    : 'continue'            { $$ = new ast.ContinueNode(yy.last(), @1); }
    ;

throwControl
    : 'throw' expression    { $$ = new ast.ThrowNode(yy.last(), @1, $2); }
    ;

//*************************************************************************************************

nativeFuns
    : '@' type 'println' '(' paramDeclarationList ')'
      '{' funSentenceList '}'               { $$ = new ast.ClassLevelFunDeclaration(yy.last(), @2, [new ast.AddStaticModifier()], $2, undefined, $3, $5, $8); }
    | '@' type 'print' '(' paramDeclarationList ')'
      '{' funSentenceList '}'               { $$ = new ast.ClassLevelFunDeclaration(yy.last(), @2, [new ast.AddStaticModifier()], $2, undefined, $3, $5, $8); }
    | '@' type 'str' '(' paramDeclarationList ')'
       '{' funSentenceList '}'               { $$ = new ast.ClassLevelFunDeclaration(yy.last(), @2, [new ast.AddStaticModifier()], $2, undefined, $3, $5, $8); }
    | '@' type 'toDouble' '(' paramDeclarationList ')'
           '{' funSentenceList '}'               { $$ = new ast.ClassLevelFunDeclaration(yy.last(), @2, [new ast.AddStaticModifier()], $2, undefined, $3, $5, $8); }
    | '@' type 'toInt' '(' paramDeclarationList ')'
           '{' funSentenceList '}'               { $$ = new ast.ClassLevelFunDeclaration(yy.last(), @2, [new ast.AddStaticModifier()], $2, undefined, $3, $5, $8); }
    | '@' type 'toChar' '(' paramDeclarationList ')'
           '{' funSentenceList '}'               { $$ = new ast.ClassLevelFunDeclaration(yy.last(), @2, [new ast.AddStaticModifier()], $2, undefined, $3, $5, $8); }
    | '@' type IDENTIFIER '(' paramDeclarationList ')'
           '{' funSentenceList '}'               { $$ = new ast.ClassLevelFunDeclaration(yy.last(), @2, [new ast.AddStaticModifier()], $2, undefined, $3, $5, $8); }
    ;


simplePrint
    : '#' 'print' '(' IDENTIFIER ',' expression ')'        { $$ = new ast.SimplePrintNode(yy.last(), @2, $4, $6); }
    ;