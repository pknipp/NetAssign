import cexprtk
from random import random, randint, seed

seed()
dec = 4

def version(question_code, inputs, answer_code):
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
            answer = round(cexprtk.evaluate_expression(answer_code, kwargs), dec)
            return dict(question=question, answer=answer)
