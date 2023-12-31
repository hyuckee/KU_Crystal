// 'DataTable' 키에서 JSON 문자열로 저장된 데이터를 가져와서 사용
try {
    const dfJSON = localStorage.getItem(localStorage.key(0));
    const df = new dfd.DataFrame(JSON.parse(dfJSON)); // JSON 문자열을 파싱하여 DataFrame으로 변
    console.log('기존 데이터가 로드되었습니다:');
    window.df = df;
    df.asType('학년', 'string')
    df.print();
} catch (error) {
    console.error('데이터 로드 중 오류가 발생했습니다:', error);
}


function getProfList() {
    try {
        const prof_set = df.loc({ columns: ['교수'] }).values.flat()
        const prof_splitted = new Set()

        prof_set.forEach((i) => {
            if (i.includes(',')) {
                let temp = i.trim().replace(/"/g, '').split(',');
                temp.forEach((j) => {
                    prof_splitted.add(j.trim());
                });
            } else {
                prof_splitted.add(i);
            }
        });
        prof_splitted.delete('미배정');

        let prof_list = Array.from(prof_splitted);
        prof_list.sort()
        return prof_list
    } catch (error) {
        console.error('전처리 된 파일이 없습니다.', error)
    }
}

function make_timetable(prof) {
    let timeTableObject = document.querySelector('#timetable tbody')
    timeTableObject.innerHTML = ''

    const time_col = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
        '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30']

    const dayDict = { '월': 0, '화': 1, '수': 2, '목': 3, '금': 4, '토': 5 }

    // Array를 사용하여 6x23 크기의 0으로 초기화된 배열 생성
    let template = Array.from({ length: 6 }, () => Array(23).fill(0));

    // Array를 사용하여 6x23 크기의 빈 문자열로 초기화된 배열 생성
    let stemplate = Array.from({ length: 6 }, () => Array(23).fill(''));

    let timetable = {};
    let classtable = {};
    let prof_rows = df.loc({ columns: ['교수'] }).values.flat().map((item, index) => {
        if (item.includes(prof)) return index;
        else return -1;
    }).filter((item) => item !== -1);

    // Danfo.js DataFrame에서 '강의실' 컬럼이 room과 일치하는 행만 필터링하고 반복문 실행
    for (let i = 0; i < prof_rows.length; i++) {
        let rowIndex = prof_rows[i];
        let row = df.iloc({ rows: [rowIndex] });

        let day = row.loc({ columns: ['요일'] }).values[0][0];
        let times = row.loc({ columns: ['강의시간'] }).values[0][0].split('-');
        let start_time = parseInt(times[0]) - 1;
        let end_time = parseInt(times[1]);

        // timetable 및 classtable에 강의실이 이미 있는 경우
        if (timetable[prof]) {
            for (let i = start_time; i < end_time; i++) {
                timetable[prof][dayDict[day]][i] = 1;
                classtable[prof][dayDict[day]][i] = row.loc({ columns: ['과목명'] }).values[0][0] + '\n' + row.loc({ columns: ['강의실'] }).values[0][0];
            }
        } else {
            let copied_template = JSON.parse(JSON.stringify(template));
            let copied_classes = JSON.parse(JSON.stringify(stemplate));
            for (let i = start_time; i < end_time; i++) {
                copied_template[dayDict[day]][i] = 1;
                copied_classes[dayDict[day]][i] = row.loc({ columns: ['과목명'] }).values[0][0] + '\n' + row.loc({ columns: ['강의실'] }).values[0][0];
            }
            timetable[prof] = copied_template;
            classtable[prof] = copied_classes;
        }
    }

    try {
        // 시간표 내용 형식으로 만들기
        let valueList = [];
        window.valueList = valueList
        for (let i = 0; i < 22; i++) {
            let val_row = [];
            for (let j = 0; j < 7; j++) {
                if (j === 0) {
                    val_row.push(time_col[i]);
                } else {
                    if (timetable[prof][j - 1][i] === 1) {
                        val_row.push(classtable[prof][j - 1][i]);
                    } else {
                        val_row.push('');
                    }
                }
            }
            valueList.push(val_row);
        }
        console.log(valueList);
    } catch (error) {
        console.error(`${prof} not in dataset`);
        return;
    }

    for (let line of valueList) {
        let tr = document.createElement('tr');
        for (let cell_data of line) {
            let td = document.createElement('td');
            td.textContent = cell_data;
            tr.appendChild(td);
        }
        timeTableObject.appendChild(tr);
    }
}

let profs = getProfList();
console.log(profs);
let dataset = document.querySelector("#searchOptions");

profs.forEach((option_value) => {
    let option = document.createElement('option');
    option.value = option_value;
    dataset.appendChild(option);
});

function button_click_event() {
    //let selected = document.querySelector("#buildings").value;
    let input_val = document.querySelector("#user-input").value.trim();
    if (input_val === '미배정') {
        document.querySelector("#user-input").value = '-'
        return
    }
    document.querySelector("#prof_text").innerText = input_val + "교수님";
    let prof = input_val;
    console.log(prof)
    make_timetable(prof);
    document.querySelector("#user-input").value = '';
}