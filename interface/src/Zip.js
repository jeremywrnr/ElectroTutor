const Zip = rows => rows[0].map((_,c) => rows.map(row=>row[c]))

export default Zip