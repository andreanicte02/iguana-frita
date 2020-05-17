
/* lexical grammar */
%lex


%s                comment



EscapeSequence                  ('\\' [btnfr"'\\])
SingleCharacter                 [^'\\]
StringCharacter                 [^"\\] | {EscapeSequence}
StringCharacters                {StringCharacter}+

JSharpCharacterLiteral            ('\''{SingleCharacter}'\'')|('\''{EscapeSequence}'\'')
JSharpStringLiteral               '"' {StringCharacters}? '"'



%%
"/*"                  {

                        this.begin('comment');
                        }
<comment>"*/"         {

                        this.popState();
                        }
<comment>.            /* skip comment content*/

"#print"                return '#print'
"as"                    return 'as'
"define"                return 'define'
"strc"                  return 'strc'

"break"                 return 'break'
"boolean"               return 'boolean'

"case"                  return 'case'
"char"                  return 'char'
"continue"              return 'continue'

"default"               return 'default'
"double"                return 'double'
"do"                    return 'do'

"else"                  return 'else'
"false"                 return 'false'
"for"                   return 'for'

"if"                    return 'if'
"import"                return 'import'
"integer"               return 'integer'

"null"                  return 'NULL'

"return"                return 'return'

"switch"                return 'switch'
"str"                   return 'str'

"throw"                 return 'throw'
"true"                  return 'true'

"void"                  return 'void'
"while"                 return 'while'
"var"                   return 'var'
"const"                 return 'const'
"global"                return 'global'

"//".*                /* skip comments */

\s+                   /* skip whitespace */


"{"                     return '{'
"}"                     return '}'
"[]"                    return '[]'
"["                     return '['
"]"                     return ']'
";"                     return ';'
":="                     return ':='
":"                     return ':'
"?"                     return '?'
","                     return ','

[0-9]+"."[0-9]+         return 'DOUBLE'
[0-9]+                  return 'INTEGER'
{JSharpCharacterLiteral}  return 'CHAR';
{JSharpStringLiteral}     return 'STRING';


"."                     return '.'


"||"                    return '||'
"&&"                    return '&&'

"!="                    return '!='
"!"                     return '!'

"%"                   return '%'
"*"                   return '*'
"/"                   return '/'
"--"                  return '--'
"-"                   return '-'
"++"                  return '++'
"+"                   return '+'
"^^"                  return '^^'
"^"                   return '^'
"!"                   return '!'
"%"                   return '%'
"("                   return '('
")"                   return ')'

"==="                    return '==='
"=="                    return '=='
"="                     return '='

"<="                    return '<='
">="                    return '>='
"<"                     return '<'
">"                     return '>'
"@"                     return '@'




[a-zA-Z_][a-zA-Z0-9_]*    return 'IDENTIFIER';

<<EOF>>               return 'EOF'
.                     return 'INVALID'

/lex




/* operator associations and precedence */

%right '?'
%left '++'
%left '^'
%left '||'
%left '&&'
%left '==' '!=' '==='
%left '<' '>' '<=' '>='
%left '+' '-'
%left '*' '/' '%'
%left '^^'

%right UMINUS
%right 'strc' UCHAR UINT UDOUBLE

%left '--' '++' '!'
%left '.' '['

%left HOPE2
%left HOPE

%start withBeingDrunk

%% /* language grammar */

withBeingDrunk
    : globalSentenceList EOF            { return $1; }
    ;

globalSentenceList
    : globalSentences                   { $$ = $1; }
    | %empty                            { $$ = []; }
    ;
globalSentences
    : globalSentences globalSentence    { $$ = $1.concat($2); }
    | globalSentence                    { $$ = [$1];          }
    | importSentence ";"                { $$ = $1; }
    ;
globalSentence
    : classLevelVarDeclaration ';'      { $$ = $1; }
    | classLevelFunDeclaration          { $$ = $1; }
    | structureDeclaration ';'          { $$ = $1; }
    | otherDeclaration ';'              { $$ = $1; }
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
    | structureDeclaration ';'      { $$ = $1; }
    | otherDeclaration  ';'         { $$ = $1; }
    ;

/* ********************************************************** */
/* ********************** Sentences ************************* */

importSentence
    : 'import' imports          { $$ = $2; }
    ;
imports
    : imports ',' importPath    { $$ = $1.push(...$3); }
    | importPath                { $$ = $1; }
    ;
importPath
    : STRING                    { $$ = importNodes(yy.last(), JSON.parse($1)); }
    ;

structureDeclaration
    : 'define' IDENTIFIER 'as' '[' attributes ']'   { $$ = new ast.NodoDeclararEstructura( ast.fl(yy, @2), $2, $5 ); }
    ;
attributes
    : attributes ',' attribute                      { $$ = $1.concat($3); }
    | attribute                                     { $$ = [$1];          }
    ;
attribute
    : type IDENTIFIER '=' expression            {
                                                    $$ = {
                                                        declaracion: new ast.NodoDeclararAtributo(ast.fl(yy, @2), $1, $2),
                                                        asignacion: new ast.NodoAsignarAtributo(ast.fl(yy, @3), $2, $4),
                                                    };
                                                }
    | type IDENTIFIER                           { $$ = { declaracion: new ast.NodoDeclararAtributo(ast.fl(yy, @2), $1, $2) }; }
    | type '[' ']' IDENTIFIER '=' expression    {

                                                    $$ = {
                                                        declaracion: new ast.NodoDeclararAtributo(ast.fl(yy, @2), $1, $4, true),
                                                        asignacion: new ast.NodoAsignarAtributo(ast.fl(yy, @3), $4, $6),
                                                    };
                                                }
    | type '[]' IDENTIFIER '=' expression    {

                                                        $$ = {
                                                            declaracion: new ast.NodoDeclararAtributo(ast.fl(yy, @2), $1, $3, true),
                                                            asignacion: new ast.NodoAsignarAtributo(ast.fl(yy, @3), $3, $5),
                                                        };
                                                    }
    | type '[' ']' IDENTIFIER                   { $$ = { declaracion: new ast.NodoDeclararAtributo(ast.fl(yy, @2), $1, $4, true) }; }
    | type '[]' IDENTIFIER                      { $$ = { declaracion: new ast.NodoDeclararAtributo(ast.fl(yy, @2), $1, $3, true) }; }
    ;


classLevelVarDeclaration
    : type varDeclarations                          { $$ = new ast.NodoDeclararVarTipo5(ast.fl(yy, @1), $1, false, $2);  }
    | type '[' ']' varDeclarations                  { $$ = new ast.NodoDeclararVarTipo5(ast.fl(yy, @1), $1, true, $4);  }
    | type '[]' varDeclarations                     { $$ = new ast.NodoDeclararVarTipo5(ast.fl(yy, @1), $1, true, $3);  }
    | type varDeclarations '=' expression           { $$ = new ast.NodoDeclararVarTipo1(ast.fl(yy, @1), $1, false, $2, $4);  }
    | type '[' ']' varDeclarations '=' expression   { $$ = new ast.NodoDeclararVarTipo1(ast.fl(yy, @1), $1, true, $4, $6);  }
    | type '[]' varDeclarations '=' expression      { $$ = new ast.NodoDeclararVarTipo1(ast.fl(yy, @1), $1, true, $3, $5);  }

    ;
funLevelVarDeclaration
    : primitiveType varDeclarations                 { $$ = new ast.NodoDeclararVarTipo5(ast.fl(yy, @1), $1, false, $2);  }
    | IDENTIFIER varDeclarations                    { $$ = new ast.NodoDeclararVarTipo5(ast.fl(yy, @1), new ast.NodoObtenerTipo(ast.fl(yy,  @1), $1), false, $2);  }
    | primitiveType '[' ']' varDeclarations         { $$ = new ast.NodoDeclararVarTipo5(ast.fl(yy, @1), $1, true, $4); }
    | primitiveType '[]' varDeclarations            { $$ = new ast.NodoDeclararVarTipo5(ast.fl(yy, @1), $1, true, $3); }
    | IDENTIFIER '[]' varDeclarations               { $$ = new ast.NodoDeclararVarTipo5(ast.fl(yy, @1), new ast.NodoObtenerTipo(ast.fl(yy,  @1), $1), true, $2); }
    | primitiveType varDeclarations '=' expression  { $$ = new ast.NodoDeclararVarTipo1(ast.fl(yy, @1), $1, false, $2, $4);  }
    | IDENTIFIER varDeclarations '=' expression     { $$ = new ast.NodoDeclararVarTipo1(ast.fl(yy, @1), new ast.NodoObtenerTipo(ast.fl(yy,  @1), $1), false, $2, $4);  }
    | primitiveType '[' ']' varDeclarations '=' expression  { $$ = new ast.NodoDeclararVarTipo1(ast.fl(yy, @1), $1, true, $4, $6); }
    | primitiveType '[]' varDeclarations '=' expression     { $$ = new ast.NodoDeclararVarTipo1(ast.fl(yy, @1), $1, true, $3, $5); }
    | IDENTIFIER '[]' varDeclarations '=' expression        { $$ = new ast.NodoDeclararVarTipo1(ast.fl(yy, @1), new ast.NodoObtenerTipo(ast.fl(yy,  @1), $1), true, $3, $5); }
    ;

otherDeclaration
    : 'var' IDENTIFIER ':=' expression { $$ = new ast.NodoDeclararVarTipo2(ast.fl(yy, @1), $2, $4 ); }
    | 'const' IDENTIFIER ':=' expression { $$ = new ast.NodoDeclararVarTipo3(ast.fl(yy, @1), $2, $4 ); }
    | 'global' IDENTIFIER ':=' expression { $$ = new ast.NodoDeclararVarTipo4(ast.fl(yy, @1), $2, $4 ); }

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

classLevelFunDeclaration
    : type  IDENTIFIER '(' paramDeclarationList ')'
      '{' funSentenceList '}'                       { $$ = new ast.NodoDeclararFuncion( ast.fl(yy, @2), $1, $2, $4, $7 ); }
    | '@' type  IDENTIFIER '(' paramDeclarationList ')'
          '{' funSentenceList '}'                       { $$ = new ast.NodoDeclararFuncion( ast.fl(yy, @3), $2, $3, $5, $8, false, true); }
    | type '[' ']' IDENTIFIER '(' paramDeclarationList ')'
      '{' funSentenceList '}'                       { $$ = new ast.NodoDeclararFuncion( ast.fl(yy, @2), $1, $4, $6, $9, true ); }
    | '@' type '[' ']' IDENTIFIER '(' paramDeclarationList ')'
          '{' funSentenceList '}'                       { $$ = new ast.NodoDeclararFuncion( ast.fl(yy, @2), $2, $5, $7, $10, true, true ); }
    | type '[]' IDENTIFIER '(' paramDeclarationList ')'
      '{' funSentenceList '}'                       { $$ = new ast.NodoDeclararFuncion( ast.fl(yy, @2), $1, $3, $5, $8, true ); }
    | '@' type '[]' IDENTIFIER '(' paramDeclarationList ')'
          '{' funSentenceList '}'                       { $$ = new ast.NodoDeclararFuncion( ast.fl(yy, @2), $2, $4, $6, $9, true, true ); }
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
    : type '[' ']' IDENTIFIER       { $$ = new ast.NodoDeclararParametro( ast.fl(yy, @2), $1, $4, true ); }
    | type '[]' IDENTIFIER       { $$ = new ast.NodoDeclararParametro( ast.fl(yy, @2), $1, $3, true ); }
    | type IDENTIFIER               { $$ = new ast.NodoDeclararParametro( ast.fl(yy, @2), $1, $2, false); }
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
    | expression '/' expression             { $$ = new ast.NodoDivision(ast.fl(yy, @1), $1, $3); }
    | expression '%' expression             { $$ = new ast.NodoModular(ast.fl(yy, @1), $1, $3); }
    | expression '!=' expression            { $$ = new ast.NodoDesigualdadValor(ast.fl(yy, @1), $1, $3); }
    | expression '==' expression            { $$ = new ast.NodoIgualdadValor(ast.fl(yy, @1), $1, $3); }
    | expression '<' expression             { $$ = new ast.NodoRelacional(ast.fl(yy, @1), $1, $2, $3); }
    | expression '>' expression             { $$ = new ast.NodoRelacional(ast.fl(yy, @1), $1, $2, $3); }
    | expression '<=' expression            { $$ = new ast.NodoRelacional(ast.fl(yy, @1), $1, $2, $3); }
    | expression '>=' expression            { $$ = new ast.NodoRelacional(ast.fl(yy, @1), $1, $2, $3); }
    | expression '||' expression            { $$ = new ast.NodoOr(ast.fl(yy, @2), $1, $3); }
    | expression '&&' expression            { $$ = new ast.NodoAnd(ast.fl(yy, @2), $1, $3); }
    | expression '^^' expression            { $$ = new ast.NodoPotencia(ast.fl(yy, @1), $1, $3); }
    | expression '^' expression             { $$ = new ast.NodoXor(ast.fl(yy, @2), $1, $3); }
    | expression '.' IDENTIFIER             { $$ = new ast.NodoAccesoPunto( ast.fl(yy, @2), $1, $3 );  }
    | dotInvoke                             { $$ = $1; }
    | normalInvoke                          { $$ = $1; }
    | STRING                                { $$ = new ast.NodoCrearString( ast.fl(yy, @1), JSON.parse($1) ); }
    | CHAR                                  { $$ = new ast.NodoCrearChar( ast.fl(yy, @1), JSON.parse('"' + $1.slice(1, -1) + '"') ); }
    | DOUBLE                                { $$ = new ast.NodoCrearDouble(ast.fl(yy, @1), $1 ); }
    | INTEGER                               { $$ = new ast.NodoCrearInteger(ast.fl(yy, @1), $1 ); }
    | NULL                                  { $$ = new ast.NodoCrearNull(ast.fl(yy, @1)); }
    | 'true'                                { $$ = new ast.NodoCrearTrue (ast.fl(yy, @1)); }
    | 'false'                               { $$ = new ast.NodoCrearFalse(ast.fl(yy, @1)); }
    | IDENTIFIER                            { $$ = new ast.NodoObtenerVar(ast.fl(yy, @1), $1 ); }
    | expression '[' expression ']'             { $$ = new ast.NodoAccessoArray( ast.fl(yy, @1), $1, $3 ); }
    | '(' expression ')'                        { $$ = $2; }
    | '-' expression %prec UMINUS               { $$ = new ast.NodoUnarioMenos(ast.fl(yy, @1), $2); }
    | '!' expression                            { $$ = new ast.NodoNot(ast.fl(yy, @1), $2); }
    | expression "?" expression ":" expression  {  }
    | increment                                 { $$ = $1; }
    | 'strc' type '(' ')'                       { $$ = new ast.NodoInstanciar( ast.fl(yy, @1), $2 ); }
    | 'strc' type '[' expression ']'            { $$ = new ast.NodoCrearArray( ast.fl(yy, @1), $2, $4 ); }
    | casting                                   { $$ = $1; }
    | expression '===' expression               { $$ = new ast.NodoIgualdadReferencia(ast.fl(yy, @1), $1, $3); }
    | '{' expressionList '}'                    { $$ = new ast.NodoCrearArrayConValores( ast.fl(yy, @2), $2 ); }
    ;

casting
    : '(' 'integer' ')' expression %prec UINT          { $$ = new ast.NodoIntegerCast(ast.fl(yy, @1) , $4); }
    | '(' 'double' ')' expression %prec UDOUBLE        { $$ = new ast.NodoDoubleCast( ast.fl(yy, @1) , $4); }
    | '(' 'char'  ')' expression %prec UCHAR           { $$ = new ast.NodoCharCast( ast.fl(yy, @1), $4); }
    ;


// separar las sentencias
normalInvoke
    : IDENTIFIER '(' expressionList ')'     { $$ = new ast.NodoInvocar( ast.fl(yy, @1), $1, $3); }
    | '@' IDENTIFIER '(' expressionList ')' { $$ = new ast.NodiInvocarSayajin( ast.fl(yy, @1), $2, $4); }
    ;


dotInvoke
    : expression '.' IDENTIFIER '(' expressionList ')'  { $$ = new ast.NodoInvocacionPunto( ast.fl(yy, @1), $1, $3, $5); }
    ;

increment
    : expression '++'                       { $$ = new ast.NodoAumento(ast.fl(yy, @2), $1, '+'); }
    | expression '--'                       { $$ = new ast.NodoAumento(ast.fl(yy, @2), $1, '-'); }
    ;


expressionList
    : expressions                   { $$ = $1; }
    |                               { $$ = []; }
    ;
expressions
    : expressions ',' expression    { $$ = $1.concat($3); }
    | expression                    { $$ = [$1]; }
    ;

//-----------------------------
// Control sentences

whileLoop
    : 'while' '(' expression ')' '{'
        funSentenceList
      '}'                           { $$ = new ast.NodoWhile( ast.fl(yy, @1) , $3, $6); }
    ;

doWhileLoop
    : 'do' '{'
        funSentenceList
      '}' 'while' '(' expression ')'  { $$ = new ast.NodoDoWhile(ast.fl(yy, @1), $7, $3); }
    ;

forLoop
    : 'for' '(' forInit  ';' expression ';'  increment  ')' '{'
        funSentenceList
      '}'                           { $$ = new ast.NodoFor(ast.fl(yy, @1), $3, $5, $7, $10); }
    | 'for' '(' forInit  ';' expression ';'  assignation  ')' '{'
        funSentenceList
      '}'                           { $$ = new ast.NodoFor(ast.fl(yy, @1), $3, $5, $7, $10); }
    ;

forInit
    : assignation             { $$ = $1; }
    | funLevelVarDeclaration  { $$ = $1; }
    ;



switchControl
    : 'switch' '(' expression  ')'   '{'
        cases
        'default' ':' funSentenceList
    '}'                                     { $$ = new ast.NodoSwitch(ast.fl(yy, @1), $3, $6, $9);  }
    | 'switch' '(' expression  ')'   '{'
              cases
       '}'                                     { $$ = new ast.NodoSwitch(ast.fl(yy, @1), $3, $6, []);  }
    | 'switch' '(' expression  ')'   '{'

           '}'                                     { $$ = new ast.NodoSwitch(ast.fl(yy, @1), $3, [], []);  }
    ;

cases
    : cases caseBlock           { $$ = $1; $1.push($2); }
    | caseBlock                 { $$ = [$1]; }
    ;

caseBlock
    : 'case' expression ':' funSentenceList         { $$ = new ast.NodoCase(ast.fl(yy, @1), $2, $4); }
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
    : 'return' expression   { $$ = new ast.NodoReturn(ast.fl(yy, @1), $2); }
    | 'return'              { $$ = new ast.NodoReturn(ast.fl(yy, @1), undefined); }
    ;

breakControl
    : 'break'               { $$ = new ast.NodoBreak(ast.fl(yy,@1)); }
    ;

continueControl
    : 'continue'            { $$ = new ast.NodoContinue(ast.fl(yy, @1)); }
    ;

throwControl
    : 'throw' expression    { $$ = new ast.ThrowNode(yy.last(), @1, $2); }
    ;

//*************************************************************************************************

nativeFuns
    : '@' type 'str' '(' paramDeclarationList ')'
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
    : '#print' '(' IDENTIFIER ',' expression ')'        { $$ = new ast.NodoPrintSimple( ast.fl(yy, @1) , $3, $5); }
    ;