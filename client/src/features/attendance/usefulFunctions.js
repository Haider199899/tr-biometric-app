function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }
  
 export function getComparator(order, orderBy) {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }
  

export function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  const diff_hours = (dt2, dt1) => {
    let diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60 * 60;
    return Math.abs(Math.round(diff));
  };

    //return productive hours for one user of his first checkin nd last checkout
 
 export const get_productive_hours = (oneUser) => {
    if (oneUser) {
      let checkin, checkout;
      if (oneUser[0].state === "check-in") {
        checkin = oneUser[0].attendanceTime;
      }
      for (let i = 0; i < oneUser.length; i++) {
        if (oneUser[i].state === "check-out")
          checkout = oneUser[i].attendanceTime; }
      return diff_hours(new Date(checkin), new Date(checkout));
    }
    return null;
  };


  export const  getDaysArray = (s, e) => {
    for (
      var a = [], d = new Date(s);
      d <= new Date(e);
      d.setDate(d.getDate() + 1)
    ) {
      a.push(new Date(d));
    }
    return a;
  };