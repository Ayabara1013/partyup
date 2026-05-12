const getMillisec = {
    createdAt: (data: { createdAt: string | Date }) =>
        new Date(data.createdAt).getTime(),

    updatedAt: (data: { updatedAt: string | Date }) =>
        new Date(data.updatedAt).getTime(),
};

export {getMillisec}