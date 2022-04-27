#!/usr/bin/python3
# -*- coding: utf-8 -*-

from wsparser import WordstatParser
import time

print("Content-Type: text/html\n")

url ='https://api-sandbox.direct.yandex.ru/v4/json/'

token = ''

userName = ''

minusWords = [
    '-купить', 
    '-дешево',
    '-скачать',
    '-бесплатно'
    ]

phrases = [
    'пластиковые окна в Чебоксарах',
    'пластиковые окна в Козловке'
    ]

geo = []

data = []
for i in range(len(phrases)):
    data.append(phrases[i])
    for j in range(len(minusWords)):
        data[i] += ' '+minusWords[j]

parser = WordstatParser(url, token, userName)

try:
    units = parser.getClientUnits()
    if 'data' in units:
        print ('>>> Ballov ostalos: ', units['data'][0]['UnitsRest'])
    else:
        raise Exception('Ne udalos poluchit bally', units)

    response = parser.createReport(data, geo)
    if 'data' in response:
        reportID = response['data']
        print ('>>> Sozdaetsya otchet s ID = ', reportID)
    else:
        raise Exception('Ne udalos sozdat othcet', response)
        
    reportList = parser.getReportList()
    if 'data' in reportList:
        lastReport = reportList['data'][len(reportList['data'])-1]
        i = 0
        while lastReport['StatusReport'] != 'Done':
            print ('>>> Podgotovka otcheta, wait ... ('+str(i)+')')
            time.sleep(2)
            reportList = parser.getReportList()
            lastReport = reportList['data'][len(reportList['data'])-1]
            i+=1
        print ('>>> Otchet ID = ', lastReport['ReportID'], ' Gotovo!')
    else:
        raise Exception('Ne  udalos prochitat spisok otchetov', reportList)

    report = parser.readReport(reportID)
    if 'data' in report:
        parser.saveReportToTxt(report, True)
        print ('>>> Resultaty sohraneny!')
    else:
        raise Exception('Ne udalos prochitat otchet', report)

    report = parser.deleteReport(reportID)
    if 'data' in report:
        print ('>>> Otchet s ID = ', reportID, ' udalen s servera')
    else:
        raise Exception('Ne udalos udalit', report)
    
    print ('>>> Vse gotovo!')
    
except Exception as e:
    print ('>>> Poymali iskluchenie:', e)
