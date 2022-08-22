let inputField = document.querySelector("input[type='text']");
let numsButtons = Array.from(document.getElementsByClassName("num"));
let clear = document.getElementById("clear");
let dot = document.getElementById("dot");
let equal = document.getElementById("equal");
let operations = document.querySelectorAll(".operation");

function inputNum(num) {
  if (status == "equal") {
    if (Number.isInteger(+num) || num == ".") {
      clearInput();
    }
  }
  inputField.value +=
    (num == "." && status == "equal") ||
    (!Number.isInteger(+inputField.value[inputField.value.length - 1]) &&
      num == ".")
      ? "0."
      : num;
  status = "input";
}

function clearInput() {
  inputField.value = "";
}

function convertToArr(val) {
  let marks = val.split("").filter((e) => !Number.isInteger(+e) && e != ".");
  let nums = val.replaceAll(/[*/+-]/g, ",").split(",");
  if (nums[nums.length - 1] == "") {
    nums.length = nums.length - 1;
    marks.length = marks.length - 1;
  }
  return { marks: marks, nums: nums };
}

function calc(nums, operations) {
  while (operations.length != 0) {
    if (operations.includes("*") || operations.includes("/")) {
      if (operations.includes("*") && operations.includes("/")) {
        if (operations.indexOf("*") < operations.indexOf("/")) {
          nums.splice(operations.indexOf("*"), 2, +nums[operations.indexOf("*")] * +nums[operations.indexOf("*") + 1]);
          operations.splice(operations.indexOf("*"), 1);
        } else {
          nums.splice(operations.indexOf("/"), 2, +nums[operations.indexOf("/")] / +nums[operations.indexOf("/") + 1]);
          operations.splice(operations.indexOf("/"), 1);
        }
      }
      else if (operations.includes("*")) {
        nums.splice(operations.indexOf("*"), 2, +nums[operations.indexOf("*")] * +nums[operations.indexOf("*") + 1]);
        operations.splice(operations.indexOf("*"), 1);
      }
      else if (operations.includes("/")) {
        nums.splice(operations.indexOf("/"), 2, +nums[operations.indexOf("/")] / +nums[operations.indexOf("/") + 1]);
        operations.splice(operations.indexOf("/"), 1);
      }
    } else if (operations.includes("+") || operations.includes("-")) {
      if (operations.includes("+") && operations.includes("-")) {
        if (operations.indexOf("+") < operations.indexOf("-")) {
          nums.splice(operations.indexOf("+"), 2, +nums[operations.indexOf("+")] + +nums[operations.indexOf("+") + 1]);
          operations.splice(operations.indexOf("+"), 1);
        } else {
          nums.splice(operations.indexOf("-"), 2, +nums[operations.indexOf("-")] - +nums[operations.indexOf("-") + 1]);
          operations.splice(operations.indexOf("-"), 1);
        }
      }
      else if (operations.includes("+")) {
        nums.splice(operations.indexOf("+"), 2, +nums[operations.indexOf("+")] + +nums[operations.indexOf("+") + 1]);
        operations.splice(operations.indexOf("+"), 1);
      }
      else if (operations.includes("-")) {
        nums.splice(operations.indexOf("-"), 2, +nums[operations.indexOf("-")] - +nums[operations.indexOf("-") + 1]);
        operations.splice(operations.indexOf("-"), 1);
      }
    }
  }
  return nums[0];
}

let status = "input";

inputField.addEventListener("keydown", function (e) {
  if (!e.code.toLowerCase().startsWith("backspace")) {
    e.preventDefault();
  }
  if (/NumpadDecimal/g.test(e.code)) {
    let numsArr = String(inputField.value).split(/[/*\-+]/g);
    if (!numsArr[numsArr.length - 1].includes(".")) {
      inputNum(".");
    }
  } else if (/Numpad(Divide|Add|Multiply|Subtract)/g.test(e.code)) {
    if (
      Number.isInteger(+String(inputField.value)[inputField.value.length - 1])
    ) {
      inputNum(e.key);
    }
  } else if (
    e.code.toLowerCase().startsWith("digit") ||
    (/\bNumpad/g.test(e.code) && !/(Enter)\b/g.test(e.code))
  ) {
    inputNum(e.key);
    if (status == "equal") {
      clearInput();
    }
  }
  if (e.code.toLowerCase().endsWith("enter")) {
    equal.click();
  }
});

numsButtons.forEach((n) => {
  n.addEventListener("click", (e) => {
    inputNum(e.target.textContent);
  });
});

operations.forEach((o) => {
  o.addEventListener("click", (e) => {
    if (
      Number.isInteger(+String(inputField.value)[inputField.value.length - 1])
    ) {
      inputNum(o.dataset.operation);
    }
  });
});

clear.addEventListener("click", clearInput);

dot.addEventListener("click", () => {
  let numsArr = String(inputField.value).split(/[/*\-+]/g);
  if (!numsArr[numsArr.length - 1].includes(".")) {
    inputNum(".");
  }
});

equal.addEventListener("click", () => {
  inputField.value = calc(
    convertToArr(inputField.value).nums,
    convertToArr(inputField.value).marks
  );
  status = "equal";
});