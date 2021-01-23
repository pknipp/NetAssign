import cexprtk
from random import random, randint, seed
from . import parse

seed()
dec = 4

def version(question_code, inputs, answer_code):
    parse_out = parse.parse(question_code, inputs)
    vars = parse_out["vars"]
    kwargs = dict()
    for i in range(len(inputs)):
        input = inputs[i][0]
        if isinstance(input, list):
            n2 = len(input) - 1
            n1 = len(inputs[i])
            index = randint(1, n2)
            for j in range(n1):
                key = inputs[i][j][0]
                value = inputs[i][j][index]
                kwargs[key] = value
        else:
            key = inputs[i][0]
            value = round(inputs[i][1]+(inputs[i][2]-inputs[i][1])*randint(0, inputs[i][3])/inputs[i][3] ,dec)
            kwargs[key] = value
    question = question_code.format(**kwargs)
    # First, see if this answer is numerical and unrandomized
    try:
        answer = float(answer_code)
    except ValueError:
        # Next, see if the answer is for randomized T/F or fill-in-the-blank questions
        if answer_code in vars:
            answer = kwargs[answer_code]
            if answer == True:
                answer = "T"
            if answer == False:
                answer = "F"
        # Finally, the answer must be for randomized numerical question
        else:
            answer = round(cexprtk.evaluate_expression(answer_code, kwargs), dec)
    return dict(question=question, answer=answer)
