export default function deferPromise(): {
    then: (f: any) => any;
    callback: (err: any, ...data: any[]) => any;
    promise: any;
};
