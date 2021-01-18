import cexprtk
from random import random, randint, seed

seed()
dec = 4

def version(question, inputs, answer):
            x = list()
            input = dict()
            for i in range(len(inputs)):
                x.append(round(inputs[i][0]+(inputs[i][1]-inputs[i][0])*randint(0, inputs[i][2])/inputs[i][2],dec))
                input["x" + str(i)] = x[i]
            question = question.format(*x)
            answer = round(cexprtk.evaluate_expression(answer, input),dec)
            return dict(question=question, answer=answer)
