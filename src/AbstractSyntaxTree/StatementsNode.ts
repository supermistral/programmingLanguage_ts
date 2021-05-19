import RootNode from './RootNode';


export default class StatementsNode extends RootNode {
    codeLines: RootNode[] = [];

    add(node: RootNode) {
        this.codeLines.push(node);
    }
}