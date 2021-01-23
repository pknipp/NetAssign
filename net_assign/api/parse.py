def parse(question_code, inputs):
    keywords = ['min', 'max', 'avg', 'sum', 'abs', 'ceil', 'floor', 'round', 'roundn', 'exp', 'log', 'log10', 'logn', 'pow', 'root', 'sqrt', 'clamp', 'inrange', 'swap', 'sin', 'cos', 'tan', 'acos', 'asin', 'atan', 'atan2', 'cosh', 'cot', 'csc', 'sec', 'sinh', 'tanh', 'd2r', 'r2d', 'd2g', 'g2d', 'hyp', 'and', 'nand', 'nor', 'not', 'or', 'xor', 'xnor', 'mand', 'mor']
    question_vars = set()
    errors = list()
    print("question_code = ", question_code)
    question_frags = question_code.split("{")
    if question_frags[0].count("}") > 0:
        errors.append("Your question code starts with a closing - rather than opening - brace.")
    del question_frags[0]
    for frag in question_frags:
        frags = frag.split("}")
        if len(frags) == 1:
            errors.append("In your question code you forgot to close a brace.")
        if len(frags) > 2:
            errors.append("In your question code you forgot an opening brace.")
        question_vars.add(frags[0])
    input_vars = set()
    for input in inputs:
        if isinstance(input[0], str):
            input_vars.add(input[0])
        else:
            subinput_length = len(input[0])
            if subinput_length < 1:
                errors.append("Your input list cannot be empty.")
            for subinput in input:
                print("subinput = ", subinput)
                print("len(subinput) = ", len(subinput))
                input_vars.add(subinput[0])
                if not len(subinput) == subinput_length:
                    errors.append("One of your array sizes is mismatched.")
    for var in question_vars:
        if not var in input_vars:
            errors.append("Your question code references an undefined variable.")
    for var in input_vars:
        if var in keywords:
            errors.append("{0} is a reserved keyword, so you must change the name of your variable.".format(var))
    return {"errors": errors}
