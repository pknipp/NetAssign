import cexprtk
from random import random, randint, seed

seed()
dec = 4

def version(question_code, inputs, answer_code):
            kwargs = dict()
            for i in range(len(inputs)):
                # randomized value
                value = round(inputs[i][1]+(inputs[i][2]-inputs[i][1])*randint(0, inputs[i][3])/inputs[i][3] ,dec)
                key = inputs[i][0]
                kwargs[key] = value
            question = question_code.format(**kwargs)
            answer = round(cexprtk.evaluate_expression(answer_code, kwargs), dec)
            return dict(question=question, answer=answer)
