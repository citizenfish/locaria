from more_itertools import unique_everseen
from operator import itemgetter

L = [('foo',1,10),('foo',1,2), ('foo',1,1), ('baa',1,9), ('baa', 1, 10)]
L.sort(key=itemgetter(0,1))

res = list(unique_everseen(L, key = itemgetter(0,1)))

print(res)