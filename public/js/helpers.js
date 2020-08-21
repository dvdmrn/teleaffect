function mapRange(inputY, yMin,yMax,xMin,xMax){
	percent = (inputY - yMin) / (yMax - yMin);
	outputX = percent * (xMax - xMin) + xMin;
	return outputX;
}