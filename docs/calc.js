/*global $ */
var hasPointer=false;
var num = "";
var stack = [];
var infixStack=[];
var prevValue="";
var display = ""; 
var tempStack=[];
var postfixString="";
var postfixStack=[];


function isOperator(x){
  if(x=="-"||x=="+"||x=="X"||x=="/"){
    return 1;
  }
  else return 0;
}

function isEquals(x){
  if(x=="="){
    return 1;
  }
  else return 0;
}

function isNumber(x){
  if(x=="1"||x=="2"||x=="3"||x=="4"||x=="5"||x=="6"||x=="7"||x=="8"||x=="9"||x=="0"){
    return 1;
  }
  else return 0;
}

function IsMultiplyOrDivide(x){
	if(x=="/"||x=="X"){
		return true;
	}
	else{
		return false;
	}
}

function returnPrecedence(x){
  switch(x){
    case "+":
      return 1;
      break;
    case "-":
      return 1;
      break;
    case "X":
      return 2;
      break;
    case "/":
      return 2;
      break;
  }
}
/*Evaluates two operators and returns the result*/
function evaluate(op1,op2,operator){
	console.log("Op1,Op2,operator"+op1,op2,operator);
  switch(operator){
    case "+":
      return parseFloat(op1)+parseFloat(op2);
      break;
    case "-":
      return parseFloat(op1)-parseFloat(op2);
      break;
    case "/":
      return parseFloat(op1)/parseFloat(op2);
      break;
    case "X":
      return parseFloat(op1)*parseFloat(op2);
      break;
  }
}

/*The display function, it needs to be specially handled as the text box is not able to display numbers larger than 15 digits*/
function displayOutput(stack){
		if(stack.length<=15){
			$("#output-text").val(stack.join(""));
		}
		else{
			$("#output-text").val(stack.join("").slice(stack.length-15,stack.length));
		}
}
/*The main logic for handling the clicks on the calculator*/
$(".flex-wrapper").click(function(e) {
  var idClicked = e.target.id;
  var value = $("#" + idClicked).attr("value");
  /*To handle the unexpected clicks in between the buttons*/
  if (value != undefined) {
    prevValue=stack[stack.length-1];
		/*Switching through different cases*/
		switch(value){
			case "=":
				var tempNum="";
				var result="";
				/*Handling invalid cases such as 
				1. If the end of the input is an operator or a decimal point
				2. If the input length is zero, which is caused by direct clicking of the equals button
				3. To eliminate case such as / or * being prefix for a number in calculation and allow numbers such as +3 and -3
				*/
				if(isOperator(stack[stack.length-1])||stack[stack.length-1]=="."||stack.length==0||IsMultiplyOrDivide(stack[0])){
					result=0;
				}
				else{
					/*With the input received, generating the infix stack, as the input from humans are always infix*/
					for(var i=0;i<stack.length;i++){
						if(!isOperator(stack[i])||i==0){
							tempNum=tempNum+stack[i];
						}
						else{
							infixStack.push(parseFloat(tempNum));
							infixStack.push(stack[i]);
							tempNum="";
						}
					}
					infixStack.push(parseFloat(tempNum));
					console.log("Infix Stack",infixStack);
					
					/*Generating a postfix stack from the infix stack*/
					for(var i=0;i<infixStack.length;i++){
						if(!isOperator(infixStack[i])){
							postfixStack.push(infixStack[i]);
						}
						else{
							if(tempStack.length==0||(returnPrecedence(infixStack[i])>returnPrecedence(tempStack[tempStack.length-1]))){
								tempStack.push(infixStack[i]);
							}
							else{
								if((returnPrecedence(infixStack[i])<=returnPrecedence(tempStack[tempStack.length-1]))){
									do{
										postfixStack.push(tempStack.pop());
									}while(returnPrecedence(infixStack[i])<=returnPrecedence(tempStack[tempStack.length-1]))
										tempStack.push(infixStack[i]);
								}	
							}
						}
					}
					var lenTempStack=tempStack.length;
					for(var i=0;i<lenTempStack;i++){
						postfixStack.push(tempStack.pop());
					}
					console.log("Postfix Stack",postfixStack);
					var evaluatingStack=[];
					
					/*Evaluating the infix stack and generating the output*/
					for(var i=0;i<postfixStack.length;i++){
						if(!isOperator(postfixStack[i])){
							evaluatingStack.push(postfixStack[i]);
						}
						else{
							var operand2=evaluatingStack.pop();
							var operand1=evaluatingStack.pop();
							var res=evaluate(operand1,operand2,postfixStack[i]);
							evaluatingStack.push(res);
						}
					}
					result=evaluatingStack.pop()
					result=(Math.round(result * 100000) / 100000);
					postfixStack=[];
				}
				/*Handling the divide by zero, i,e the infinite case*/
				$("#output-text").val(result);
				if(isFinite(result)){
					infixStack=[];
					stack=[];
					stack.push(result);
				}
				else{
					infixStack=[];
					stack=[];
				}
				break;

			case "AC":
				stack=[];
				displayOutput(stack);
				break;

			case "CE":
				stack.pop();
				displayOutput(stack);
				break;

			case "+": case "-": case "X": case "/":
				if(!isOperator(prevValue)){
					stack.push(value);
					displayOutput(stack);
					hasPointer=false;
				}
				break;

			case ".":
				if(!hasPointer){
					stack.push(value);
					displayOutput(stack);
					hasPointer=true;
				}
				break;

			default:
				stack.push(value);
				displayOutput(stack);
				break;     
		}
  }
});