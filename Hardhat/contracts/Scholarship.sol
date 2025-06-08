// SPDX-License-Identifier: MIT

pragma solidity 0.8.28;

contract ScholarDist {
    address public admin;

    constructor() {
        admin = msg.sender;
    }

    struct Scholarship {
        string name;
        uint256 amount;
        uint8 minScore;             
        uint8 totalSeats;
        uint8 requiredAttendance;
        uint8 requiredAcademic;     
        bool isActive;
        bool isProcessed;
    }

    struct Application {
        address applicant;
        string studentName;
        string regNumber;
        string college;
        string course;
        uint8 attendancePercent;
        uint8 academicMark;
        uint8 score;
        bool received;
    }

    Scholarship public scholarship;
    Application[] public applications;
    mapping(address => bool) public hasApplied;

    event ScholarshipCreated(string name, uint256 amount, uint8 minScore, uint8 totalSeats, uint8 requiredAttendance, uint8 requiredAcademic);
    event Applied(address indexed student, uint8 score);
    event Disbursed(address indexed student, uint256 amount);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    function addScholarship(
        string calldata _name,
        uint256 _amount,
        uint8 _minScore,
        uint8 _totalSeats,
        uint8 _requiredAttendance,
        uint8 _requiredAcademic
    ) external onlyAdmin {
        require(!scholarship.isActive, "Scholarship already exists");
        require(_amount > 0, "Amount must be > 0");
        require(_minScore <= 200, "Invalid min score");
        require(_totalSeats > 0, "Total seats must be > 0");
        require(_requiredAttendance <= 100 && _requiredAcademic <= 100, "Invalid percentage inputs");

        scholarship = Scholarship({
            name: _name,
            amount: _amount,
            minScore: _minScore,
            totalSeats: _totalSeats,
            requiredAttendance: _requiredAttendance,
            requiredAcademic: _requiredAcademic,
            isActive: true,
            isProcessed: false
        });

        emit ScholarshipCreated(_name, _amount, _minScore, _totalSeats, _requiredAttendance, _requiredAcademic);
    }

    function applyForScholarship(
        string calldata _studentName,
        string calldata _regNumber,
        string calldata _college,
        string calldata _course,
        uint8 _attendancePercent,
        uint8 _academicMark
    ) external {
        require(scholarship.isActive, "No active scholarship");
        require(!hasApplied[msg.sender], "Already applied");
        require(_attendancePercent <= 100 && _academicMark <= 100, "Invalid input values");

        require(_attendancePercent >= scholarship.requiredAttendance, "Attendance below required threshold");
        require(_academicMark >= scholarship.requiredAcademic, "Academic marks below required threshold");

        uint8 calculatedScore = _attendancePercent + _academicMark;

        applications.push(Application({
            applicant: msg.sender,
            studentName: _studentName,
            regNumber: _regNumber,
            college: _college,
            course: _course,
            attendancePercent: _attendancePercent,
            academicMark: _academicMark,
            score: calculatedScore,
            received: false
        }));

        hasApplied[msg.sender] = true;
        emit Applied(msg.sender, calculatedScore);
    }

    function selectTopApplicants() external onlyAdmin {
        require(scholarship.isActive, "Scholarship not active");
        require(!scholarship.isProcessed, "Already processed");
        require(applications.length > 0, "No applications");

        for (uint i = 0; i < applications.length; i++) {
            for (uint j = i + 1; j < applications.length; j++) {
                if (applications[j].score > applications[i].score) {
                    Application memory temp = applications[i];
                    applications[i] = applications[j];
                    applications[j] = temp;
                }
            }
        }

        uint8 selectedCount = 0;
        for (uint i = 0; i < applications.length && selectedCount < scholarship.totalSeats; i++) {
            if (applications[i].score >= scholarship.minScore && !applications[i].received) {
                _disburse(applications[i].applicant);
                applications[i].received = true;
                selectedCount++;
            }
        }

        scholarship.isProcessed = true;
    }

    function _disburse(address _student) internal {
        require(address(this).balance >= scholarship.amount, "Insufficient balance");

        (bool sent, ) = _student.call{value: scholarship.amount}("");
        require(sent, "Transfer failed");

        emit Disbursed(_student, scholarship.amount);
    }

    function getApplications() external view returns (Application[] memory) {
        return applications;
    }

    function getSelectedApplicants() external view returns (Application[] memory) {
        uint count = 0;
        for (uint i = 0; i < applications.length; i++) {
            if (applications[i].received) count++;
        }

        Application[] memory selected = new Application[](count);
        uint idx = 0;
        for (uint i = 0; i < applications.length; i++) {
            if (applications[i].received) {
                selected[idx++] = applications[i];
            }
        }

        return selected;
    }

    receive() external payable {}
}
