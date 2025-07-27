// SPDX-License-Identifier: MIT

pragma solidity 0.8.28;

contract ScholarDis {
    address public admin;
    uint public scholarshipCounter;

    constructor() {
        admin = msg.sender;
    }

    struct Scholarship {
        uint id;
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

    mapping(uint => Scholarship) public scholarships;
    mapping(uint => Application[]) public scholarshipApplications;
    mapping(uint => mapping(address => bool)) public hasApplied;

    event ScholarshipCreated(uint id, string name, uint256 amount);
    event Applied(uint indexed scholarshipId, address indexed student, uint8 score);
    event Disbursed(uint indexed scholarshipId, address indexed student, uint256 amount);

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
        require(_amount > 0, "Amount must be > 0");
        require(_minScore <= 200, "Invalid min score");
        require(_totalSeats > 0, "Total seats must be > 0");
        require(_requiredAttendance <= 100 && _requiredAcademic <= 100, "Invalid percentage inputs");

        scholarshipCounter++;
        scholarships[scholarshipCounter] = Scholarship({
            id: scholarshipCounter,
            name: _name,
            amount: _amount,
            minScore: _minScore,
            totalSeats: _totalSeats,
            requiredAttendance: _requiredAttendance,
            requiredAcademic: _requiredAcademic,
            isActive: true,
            isProcessed: false
        });

        emit ScholarshipCreated(scholarshipCounter, _name, _amount);
    }

    function applyForScholarship(
        uint _scholarshipId,
        string calldata _studentName,
        string calldata _regNumber,
        string calldata _college,
        string calldata _course,
        uint8 _attendancePercent,
        uint8 _academicMark
    ) external {
        Scholarship storage s = scholarships[_scholarshipId];

        require(s.isActive, "Scholarship not active");
        require(!hasApplied[_scholarshipId][msg.sender], "Already applied");
        require(_attendancePercent <= 100 && _academicMark <= 100, "Invalid input values");
        require(_attendancePercent >= s.requiredAttendance, "Attendance below threshold");
        require(_academicMark >= s.requiredAcademic, "Marks below threshold");

        uint8 calculatedScore = _attendancePercent + _academicMark;

        scholarshipApplications[_scholarshipId].push(Application({
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

        hasApplied[_scholarshipId][msg.sender] = true;
        emit Applied(_scholarshipId, msg.sender, calculatedScore);
    }

    function selectTopApplicants(uint _scholarshipId) external onlyAdmin {
        Scholarship storage s = scholarships[_scholarshipId];
        require(s.isActive, "Scholarship not active");
        require(!s.isProcessed, "Already processed");

        Application[] storage apps = scholarshipApplications[_scholarshipId];
        require(apps.length > 0, "No applications");

        for (uint i = 0; i < apps.length; i++) {
            for (uint j = i + 1; j < apps.length; j++) {
                if (apps[j].score > apps[i].score) {
                    Application memory temp = apps[i];
                    apps[i] = apps[j];
                    apps[j] = temp;
                }
            }
        }

        uint8 selectedCount = 0;
        for (uint i = 0; i < apps.length && selectedCount < s.totalSeats; i++) {
            if (apps[i].score >= s.minScore && !apps[i].received) {
                _disburse(apps[i].applicant, s.amount);
                apps[i].received = true;
                selectedCount++;
                emit Disbursed(_scholarshipId, apps[i].applicant, s.amount);
            }
        }

        s.isProcessed = true;
    }

    function _disburse(address _student, uint256 _amount) internal {
        require(address(this).balance >= _amount, "Insufficient contract balance");
        (bool sent, ) = _student.call{value: _amount}("");
        require(sent, "Transfer failed");
    }

    function getApplications(uint _scholarshipId) external view returns (Application[] memory) {
        return scholarshipApplications[_scholarshipId];
    }

    function getSelectedApplicants(uint _scholarshipId) external view returns (Application[] memory) {
        Application[] storage allApps = scholarshipApplications[_scholarshipId];
        uint count = 0;

        for (uint i = 0; i < allApps.length; i++) {
            if (allApps[i].received) count++;
        }

        Application[] memory selected = new Application[](count);
        uint idx = 0;
        for (uint i = 0; i < allApps.length; i++) {
            if (allApps[i].received) {
                selected[idx++] = allApps[i];
            }
        }

        return selected;
    }

    receive() external payable {}
}
