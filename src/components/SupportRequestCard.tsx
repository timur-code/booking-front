import React, {useState} from "react";
import ISupportRequest from "@component/models/ISupportRequest";
import adminApi from "@component/mixin/adminApi";

interface SupportRequestCardProps {
    request: ISupportRequest;
}

const SupportRequestCard: React.FC<SupportRequestCardProps> = ({request}) => {
    const [isResolved, setIsResolved] = useState(request.isResolved);

    function formatDateTime(dateTimeString: string): string {
        const date = new Date(dateTimeString);

        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');  // Months are 0-11, so add 1 and pad to 2 digits
        const day = String(date.getUTCDate()).padStart(2, '0');

        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}`;
    }

    const handleClick = async (id: number) => {
        const res = await adminApi.resolveRequest(id);
        if (res) {
            setIsResolved(res);
        }
    }


    return (
        <div>
            <div className="border-card">
                <div className="wrap-card">
                    <h4>Номер обращения: {request.id}</h4>
                    <p>Время запроса: {formatDateTime(request.dtCreate)}</p>
                    <p>Текст обращения: {request.text}</p>
                    <p>Номер телефона: {request.phone}</p>
                    <p>Статус: {isResolved ? "Решено" : "В обработке"}</p>
                    {!isResolved ?
                        (<button className={"btn btn-outline-info"} onClick={() => handleClick(request.id)}>Решено</button>)
                        : ("")
                    }
                </div>
            </div>
        </div>
    );
};

export default SupportRequestCard;