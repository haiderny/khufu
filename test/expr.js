import {compile_text as compile} from '../src/compiler.js'
import {expect} from 'chai'

describe("compiler", () => {
    const imp = 'import ' +
        '{ elementVoid, elementOpen, elementClose, text, item }' +
        ' from "khufu-runtime";\n';
    it("compiles function call", () => {
        expect(compile('import {x} from "y"\n' +
            "view main():\n x(1)"))
            .to.equal(imp +
                'import { x } from "y";\n' +
                "export function main() {\n" +
                '  return function main(key) {\n' +
                '    item(x(1), key + "-1");\n' +
                '  };\n' +
                "}")
    })
    it("compiles function call with multiple args", () => {
        expect(compile('import {x} from "y"\n' +
            "view main():\n x(1, 2, 3)"))
            .to.equal(imp +
                'import { x } from "y";\n' +
                "export function main() {\n" +
                '  return function main(key) {\n' +
                '    item(x(1, 2, 3), key + "-1");\n' +
                '  };\n' +
                "}")
    })
    it("compiles a list", () => {
        expect(compile("view main():\n [1, 2, 3]"))
            .to.equal(imp +
                "export function main() {\n" +
                '  return function main(key) {\n' +
                '    text([1, 2, 3]);\n' +
                '  };\n' +
                "}")
    })
    it("compiles math", () => {
        expect(compile("view main():\n (1+2*3)/4"))
            .to.equal(imp +
                "export function main() {\n" +
                '  return function main(key) {\n' +
                '    text((1 + 2 * 3) / 4);\n' +
                '  };\n' +
                "}")
    })
    it("compiles global names", () => {
        expect(compile('import {x} from "y"\n' +
            "view main():\n x(true, false, null)"))
            .to.equal(imp +
                'import { x } from "y";\n' +
                "export function main() {\n" +
                '  return function main(key) {\n' +
                '    item(x(true, false, null), key + "-1");\n' +
                '  };\n' +
                "}")
    })
    it("compiles boolean", () => {
        expect(compile(
            "view main():\n 1 and 2\n 3 or 4\n not 0\n 1 and 2 or 3"))
            .to.equal(imp +
                "export function main() {\n" +
                '  return function main(key) {\n' +
                '    text(1 && 2);\n' +
                '    text(3 || 4);\n' +
                '    text(!0);\n' +
                '    text(1 && 2 || 3);\n' +
                '  };\n' +
                "}")
    })
})
